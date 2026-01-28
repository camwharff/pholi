import { ref, type Ref } from 'vue'
import type { ContentCell, GridMatrix } from '@/lib/types'
import { useUserStore } from '@/stores/user'
import { authHandler } from '@/lib/authHandler'
import { uiHandler } from '@/lib/uiHandler'
import { supabase } from '@/lib/supabaseClient'
import type { MediaCell, SizeCell, TextCell, FillCell, SizeType } from '@/lib/types'

const { shortAlert } = uiHandler()

const COLS = 16
const ROWS = 9
const mediaViewable: Ref<ContentCell | undefined> = ref()
const draggedItem = ref<ContentCell>()
const disableSave = ref(false)
const sizing = ref(false)

function viewMedia(med: ContentCell, view: boolean) {
    if (view && med && (med.kind === 'media' || med.kind === 'text')) {
        mediaViewable.value = med ?? null
    } else {
        mediaViewable.value = undefined
    }
}

function getUnplaced(media: ContentCell[], pholi: GridMatrix) {
    return media.filter(
        item => !pholi.some((row: any) =>
            row.some((cell: any) => (cell as ContentCell)?.id === item.id)
        )
    )
}

function getStaged(media: ContentCell[], pholi: GridMatrix) {
    return media.filter(
        item => pholi.some((row: any) =>
            row.some((cell: any) => (cell as ContentCell)?.id === item.id)
        )
    )
}

async function updatePholi() {
    const userStore = useUserStore()
    disableSave.value = true

    const { user } = authHandler()
    if (!user.value) return
    try {
        const updates = {
            pholi: userStore.info.pholi,
            updated_at: new Date()
        }
        const { error } = await supabase.from('profiles').update(updates).eq('id', user.value.id)
        if (error) throw error
        await userStore.loadUserData(user.value.id)
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    } finally {
        shortAlert('Pholi saved')
        disableSave.value = false
    }
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
        width: 2,
        height: 2,
        type: 'filler',
        kind: 'filler'
    } as FillCell
    sizing.value = false
}

function onDragText() {
    draggedItem.value = {
        id: `text-${Date.now()}`,
        label: 'Your Text',
        width: 2,
        height: 2,
        description: '',
        type: 'text',
        kind: 'text'
    } as TextCell
    sizing.value = false
}

function onDragSize(item: SizeCell, pholi: GridMatrix) {
    const [row, col] = getIndex(item.ownerId, pholi)
    draggedItem.value = (pholi[row!]![col!] as ContentCell) ?? null
    sizing.value = true
}


function resize(r: number, c: number, id: string, pholi: GridMatrix) {
    const [row, col] = getIndex(id, pholi)
    const target = (pholi[row!]![col!] as ContentCell)
    const width_new = c - (col as number) + 1
    const height_new = r - (row as number) + 1
    if (width_new * height_new < 2) return
    changeWidth([width_new], id, pholi)
    changeHeight([height_new], id, pholi)
    const [sizer_row, sizer_col] = getIndex(`size-${target.id}`, pholi)
    pholi[sizer_row!]![sizer_col!] = null
    pholi[sizer_row as number]![sizer_col as number] = null
    for (let rw = 0; rw < height_new; rw++) {
        const gridRow = pholi[(row as number) + rw]
        if (!gridRow) continue
        for (let cl = 0; cl < width_new; cl++) {
            gridRow[(col as number) + cl] = { id: 'block', ownerId: target.id, kind: 'block' }
        }
    }
    pholi[(row as number) + target.height - 1]![(col as number) + target.width - 1] = { id: `size-${target.id}`, ownerId: target.id, kind: 'size' }
    pholi[row!]![col!] = target
    sizing.value = false
    draggedItem.value = undefined
}

function onDrop(row: number, col: number, pholi: GridMatrix) {
    if (!draggedItem.value) return

    if (sizing.value) {
        resize(row, col, draggedItem.value.id, pholi)
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
        const gridRow = pholi[r]
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
        const gridRow = pholi[row + r]
        if (!gridRow) continue
        for (let c = 0; c < width; c++) {
            gridRow[col + c] = { id: 'block', ownerId: item.id, kind: 'block' }
        }
    }

    pholi[row + item.height - 1]![col + item.width - 1] = { id: `size-${item.id}`, ownerId: item.id, kind: 'size' }
    pholi[row]![col] = item
    draggedItem.value = undefined
}

function removeItem(id: string, pholi: GridMatrix) {
    for (let r = 0; r < ROWS; r++) {
        const gridRow = pholi[r]
        if (!gridRow) continue
        for (let c = 0; c < COLS; c++) {
            const cell = gridRow[c]
            if (!cell) continue
            if ('ownerId' in cell && cell.ownerId === id) gridRow[c] = null
            if ('id' in cell && cell.id === id) gridRow[c] = null
        }
    }
}

function getIndex(id: string, pholi: GridMatrix) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (pholi[r]![c]?.id === id)
                return [r, c]
        }
    }
    return [-1, -1]
}

function changeWidth(newValue: number[] | undefined, itemId: string, pholi: GridMatrix) {
    if (newValue && newValue[0]) {
        const [row, col] = getIndex(itemId, pholi)
        if (pholi[row!]![col!]) {
            (pholi[row!]![col!] as ContentCell).width = newValue[0] as SizeType
        }
    }
}

function changeHeight(newValue: number[] | undefined, itemId: string, pholi: GridMatrix) {
    if (newValue && newValue[0]) {
        const [row, col]: number[] = getIndex(itemId, pholi)
        if (pholi[row!]![col!])
            (pholi[row!]![col!] as ContentCell).height = newValue[0] as SizeType
    }
}

export function pholiHelpers() {
    return {
        mediaViewable,
        draggedItem,
        disableSave,
        sizing,
        viewMedia,
        getUnplaced,
        getStaged,
        updatePholi,
        onDragStaged,
        onDragUnstaged,
        onDragFiller,
        onDragText,
        onDragSize,
        onDrop,
        removeItem,
        changeWidth,
        changeHeight
    }
}