import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Ref } from 'vue'
import { authHandler } from '@/lib/authHandler'
import { uiHandler } from '@/lib/uiHandler'

const { shortAlert } = uiHandler()

export type SizeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
export type GridCell = BlockCell | SizeCell | ContentCell | null
export type GridMatrix = GridCell[][]

export interface ContentCell {
    id: string
    width: SizeType
    height: SizeType
    kind: string
    label?: string
    url?: string
    description?: string
    type?: string
    coverId?: string
    coverUrl?: string
}

export interface MediaCell extends ContentCell {
    label: string
    description: string
    url: string
    type: string
    coverUrl?: string
    coverId?: string | undefined
    kind: 'media'
}

export interface FillCell extends ContentCell {
    kind: 'filler'
}

export interface TextCell extends ContentCell {
    label: string
    kind: 'text'
}

interface BlockCell {
    id: 'block'
    ownerId: string
    kind: 'block'
}

export interface SizeCell {
    id: string
    ownerId: string
    kind: 'size'
}

export interface MediaRaw {
    id: string
    path: string
    timeStamp: number
    type: string
    label?: string
    description?: string
    date?: string
    cover?: string
}

export interface NewMedia {
    file: File
    type: string
    url: string
    title?: string
    date?: string
    description?: string
    cover?: File
}

const newMedia = ref<NewMedia[]>([])
const width = ref([2])
const height = ref([2])
const preview = ref<NewMedia>()
const media_raw: Ref<MediaRaw[]> = ref([])
const media_list: Ref<MediaCell[]> = ref([])
const pholi: Ref<(GridCell)[][], GridMatrix | (GridCell)[][]> = ref([])
const mediaViewable: Ref<ContentCell | undefined> = ref()
const disableSave = ref(false)
const disableUpload = ref(false)

const filler = ['text', 'blank']
const COLS = 16
const ROWS = 9
export const nullPholi = [
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
]

const widthConfig: Record<SizeType, string> = {
    1: 'w-[100%]', 2: 'w-[200%]', 3: 'w-[300%]', 4: 'w-[400%]', 5: 'w-[500%]', 6: 'w-[600%]', 7: 'w-[700%]', 8: 'w-[800%]', 9: 'w-[900%]', 10: 'w-[1000%]', 11: 'w-[1100%]', 12: 'w-[1200%]', 13: 'w-[1300%]', 14: 'w-[1400%]', 15: 'w-[1500%]', 16: 'w-[1600%]'
}

const heightConfig: Record<SizeType, string> = {
    1: 'h-[100%]', 2: 'h-[200%]', 3: 'h-[300%]', 4: 'h-[400%]', 5: 'h-[500%]', 6: 'h-[600%]', 7: 'h-[700%]', 8: 'h-[800%]', 9: 'h-[900%]', 10: 'h-[1000%]', 11: 'h-[1100%]', 12: 'h-[1200%]', 13: 'h-[1300%]', 14: 'h-[1400%]', 15: 'h-[1500%]', 16: 'h-[1600%]'
}

function viewMedia(med: ContentCell, view: boolean) {
    if (view && med && (med.kind === 'media' || med.kind === 'text')) {
        mediaViewable.value = med ?? null
    } else {
        mediaViewable.value = undefined
    }
}

async function selectMedia(evt: Event) {

    const input = evt.target as HTMLInputElement
    const selectedFiles = input.files

    if (selectedFiles) {
        for (const newFile of selectedFiles) {
            if (newFile.size > 50000000) {
                shortAlert(`${newFile.name} exceeds size limit of 50mb`)
                continue
            }
            newMedia.value.push({
                file: newFile,
                type: newFile.type.split('/')![0] as string,
                url: URL.createObjectURL(newFile)
            })
        }
    }
    input.value = ''
}

function addCover(evt: Event) {

    const input = evt.target as HTMLInputElement
    return input.files![0]

}

async function deleteMedia(id: string) {
    const { user } = authHandler()
    if (user.value) {
        console.log(id)
        console.log(media_raw.value)
        const indexRaw = media_raw.value.findIndex(item => item.id === id)
        media_raw.value.splice(indexRaw, 1)
        await supabase.from('profiles').update({ media: [...media_raw.value] }).eq('id', user.value.id)
        await supabase.storage.from('media').remove([id])
        const index = media_list.value.findIndex(item => item.id === id)
        media_list.value.splice(index, 1)
    }
}

const uploadMedia = async (evt: Event) => {
    const { user } = authHandler()
    if (!user.value) return
    disableUpload.value = true
    const form = evt.target as HTMLFormElement

    if (newMedia.value.length === 0) {
        alert('You must select at least one file to upload.')
        return
    }

    for (const media of newMedia.value) {
        if (media.file) {
            const fileExt = media.file.name.split('.').pop()
            const filePath = `${Math.random()}.${fileExt}`
            const new_media: MediaRaw = {
                id: filePath,
                path: filePath,
                label: media.title,
                timeStamp: Date.now(),
                description: media.description,
                type: media.type,
                date: media.date
            }
            if (media.cover) {
                const coverExt = media.cover.name.split('.').pop()
                new_media.cover = `${Math.random()}.${coverExt}`
                try {
                    const { error } = await supabase.storage.from('media').upload(new_media.cover, media.cover)
                    if (error) throw error
                } catch (error) {
                    if (error instanceof Error) {
                        alert(error.message)
                        continue
                    }
                }
            }
            try {
                const { error } = await supabase.storage.from('media').upload(filePath, media.file)
                if (error) throw error
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message)
                    continue
                }
            }
            try {
                const { error } = await supabase.from('profiles').update({ media: [...media_raw.value, new_media] }).eq('id', user.value.id)
                if (error) throw error
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message)
                    continue
                }
            }
        }
    }

    disableUpload.value = false
    shortAlert('Upload complete')
    await loadMedia()
    form.reset()
    newMedia.value = []
}

const unplacedItems = computed(() =>
    media_list.value.filter(
        item => !pholi.value.some(row =>
            row.some(cell => (cell as MediaCell)?.id === item.id)
        )
    )
)

const stagedItems = computed(() =>
    media_list.value.filter(
        item => pholi.value.some(row =>
            row.some(cell => (cell as MediaCell)?.id === item.id)
        )
    )
)

async function updatePholi() {
    disableSave.value = true

    const { user } = authHandler()
    if (!user.value) return
    try {
        const updates = {
            pholi: pholi.value,
            updated_at: new Date()
        }
        const { error } = await supabase.from('profiles').update(updates).eq('id', user.value.id)
        if (error) throw error
        // dynamically import the user store to avoid circular import during module initialization
        const mod = await import('@/stores/user')
        const userStore = mod.useUserStore()
        await userStore.loadUserData(user.value.id)
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    } finally {
        shortAlert('Pholi saved')
        disableSave.value = false
    }
}

// helper to normalize pholi from DB (may be stringified)
function normalizePholi(raw: any) {
    // if string, attempt to parse
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw)
            for (const row of parsed) {
                for (const cell of row) {
                    if (cell.kind === 'media') {
                        cell.url = getSrc(cell.id)
                    }
                }
            }
            if (Array.isArray(parsed)) return parsed
        } catch {
            // fallthrough to return nullPholi
        }
    }
    // if already an array return it, otherwise fallback
    if (Array.isArray(raw)) return raw
    return nullPholi
}

async function loadMedia() {
    const { user } = authHandler()
    if (!user.value) return

    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select('media, pholi')
            .eq('id', user.value.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            media_raw.value = data.media ?? []
            pholi.value = normalizePholi(data.pholi ?? nullPholi)
        }
        if (!Array.isArray(pholi.value) || pholi.value.length <= 1) {
            pholi.value = nullPholi
        }
        await downloadMedia()
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

async function downloadMedia() {
    for (let item of Object.values(media_raw.value)) {
        if (!media_list.value.find(entry => item.id == entry.id)) {
            try {
                const coverUrl = ref<string>()
                const { data, error } = await supabase.storage.from('media').download(item.path)
                if (error) {
                    console.log(item)
                    throw error
                }
                const url = URL.createObjectURL(data)
                if (item.cover) {
                    const { data, error } = await supabase.storage.from('media').download(item.cover)
                    if (error) {
                        throw error
                    }
                    coverUrl.value = URL.createObjectURL(data)
                }
                media_list.value.push({
                    id: `${item.id}`,
                    label: `${item.label}`,
                    description: `${item.description}`,
                    url: url,
                    type: item.type,
                    coverUrl: coverUrl.value,
                    coverId: item.cover,
                    kind: 'media',
                    width: 2,
                    height: 2
                })
            } catch (error) {
                if (error instanceof Error) alert(`download error: ${error.message}`)
            }
        }
    }
}

async function setMedia(username: string) {
    try {

        const { data, error, status } = await supabase
            .from('profiles')
            .select('media, pholi')
            .eq('username', username)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            media_raw.value = data.media ?? []
            pholi.value = normalizePholi(data.pholi ?? nullPholi)
        }
        if (!Array.isArray(pholi.value)) {
            pholi.value = nullPholi
        }
        await downloadMedia()
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

const draggedItem = ref<ContentCell>()
const sizing = ref(false)

function changeText(item: TextCell) {
    item.label = "text added"
}

function onDragStaged(item: ContentCell) {
    draggedItem.value = item
    sizing.value = false
}

function onDragUnstaged(item: MediaCell) {
    draggedItem.value = {
        id: item.id,
        label: item.label,
        width: 2,
        height: 2,
        url: item.url,
        description: item.description,
        type: item.type,
        coverId: item.coverId,
        coverUrl: item.coverUrl,
        kind: 'media'
    } as MediaCell
    sizing.value = false
}

function onDragFiller() {
    draggedItem.value = {
        id: `filler-${Date.now()}`,
        label: 'Text',
        width: 2,
        height: 2,
        description: '',
        type: 'text',
        kind: 'text'
    } as TextCell
    sizing.value = false
}

function onDragSize(item: SizeCell) {
    const [row, col] = getIndex(item.ownerId)
    draggedItem.value = (pholi.value[row!]![col!] as ContentCell) ?? null
    sizing.value = true
}

async function getSrc(id: string) {
    try {
        const { data, error } = await supabase.storage.from('media').download(id)
        if (error) throw error
        return URL.createObjectURL(data)
    }
    catch (error) {
        console.log(error)
    }
}

function getCover(id: string) {
    return media_list.value.find(item => item.id === id)?.coverId
}

function resize(r: number, c: number, id: string) {
    const [row, col] = getIndex(id)
    const target = (pholi.value[row!]![col!] as ContentCell)
    const width_new = c - (col as number) + 1
    const height_new = r - (row as number) + 1
    if (width_new * height_new < 2) return
    updateWidth(id, width_new)
    updateHeight(id, height_new)
    const [sizer_row, sizer_col] = getIndex(`size-${target.id}`)
    pholi.value[sizer_row!]![sizer_col!] = null
    pholi.value[sizer_row as number]![sizer_col as number] = null
    for (let rw = 0; rw < height_new; rw++) {
        const gridRow = pholi.value[(row as number) + rw]
        if (!gridRow) continue
        for (let cl = 0; cl < width_new; cl++) {
            gridRow[(col as number) + cl] = { id: 'block', ownerId: target.id, kind: 'block' }
        }
    }
    pholi.value[(row as number) + target.height - 1]![(col as number) + target.width - 1] = { id: `size-${target.id}`, ownerId: target.id, kind: 'size' }
    pholi.value[row!]![col!] = target
    sizing.value = false
    draggedItem.value = undefined
}

function onDrop(row: number, col: number) {
    if (!draggedItem.value) return

    if (sizing.value) {
        resize(row, col, draggedItem.value.id)
        return
    }

    const item = {
        id: draggedItem.value.id,
        label: draggedItem.value.label,
        width: draggedItem.value.width,
        height: draggedItem.value.height,
        description: draggedItem.value.description,
        type: draggedItem.value.type,
        cover: draggedItem.value.coverId,
        coverUrl: draggedItem.value.coverUrl,
        kind: draggedItem.value.kind,
        url: draggedItem.value.url
    }
    const width = item.width
    const height = item.height

    if (col + width > COLS || row + height > ROWS) return

    // Clear old blocks
    for (let r = 0; r < ROWS; r++) {
        const gridRow = pholi.value[r]
        if (!gridRow) continue
        for (let c = 0; c < COLS; c++) {
            const cell = gridRow[c]
            if (!cell) continue
            if ('ownerId' in cell && cell.ownerId === item.id) gridRow[c] = null
            if ('id' in cell && cell.id === item.id) gridRow[c] = null
        }
    }

    // Fill blocks
    for (let r = 0; r < height; r++) {
        const gridRow = pholi.value[row + r]
        if (!gridRow) continue
        for (let c = 0; c < width; c++) {
            gridRow[col + c] = { id: 'block', ownerId: item.id, kind: 'block' }
        }
    }

    pholi.value[row + item.height - 1]![col + item.width - 1] = { id: `size-${item.id}`, ownerId: item.id, kind: 'size' }
    pholi.value[row]![col] = item
    draggedItem.value = undefined
}

function removeItem(id: string) {
    for (let r = 0; r < ROWS; r++) {
        const gridRow = pholi.value[r]
        if (!gridRow) continue
        for (let c = 0; c < COLS; c++) {
            const cell = gridRow[c]
            if (!cell) continue
            if ('ownerId' in cell && cell.ownerId === id) gridRow[c] = null
            if ('id' in cell && cell.id === id) gridRow[c] = null
        }
    }
}

function getIndex(id: string) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (pholi.value[r]![c]?.id === id)
                return [r, c]
        }
    }
    return [-1, -1]
}

function updateWidth(id: string, w: number) {
    const [row, col] = getIndex(id)
    if (pholi?.value[row!]![col!]) {
        (pholi.value[row!]![col!] as ContentCell).width = w as SizeType
    }
}

function updateHeight(id: string, h: number) {
    const [row, col]: number[] = getIndex(id)
    if (pholi?.value[row!]![col!])
        (pholi.value[row!]![col!] as ContentCell).height = h as SizeType
}

const changeWidth = (newValue: number[] | undefined, id: string) => {
    if (newValue && newValue[0])
        updateWidth(id, newValue[0])
}

const changeHeight = (newValue: number[] | undefined, id: string) => {
    if (newValue && newValue[0])
        updateHeight(id, newValue[0])
}


export function mediaHandler() {
    return {
        disableUpload,
        preview,
        width,
        height,
        newMedia,
        pholi,
        unplacedItems,
        stagedItems,
        widthConfig,
        heightConfig,
        filler,
        mediaViewable,
        disableSave,
        changeText,
        addCover,
        deleteMedia,
        getSrc,
        getCover,
        uploadMedia,
        updatePholi,
        onDragStaged,
        onDragUnstaged,
        onDragSize,
        onDragFiller,
        onDrop,
        removeItem,
        changeHeight,
        changeWidth,
        loadMedia,
        setMedia,
        selectMedia,
        downloadMedia,
        viewMedia
    }
}
