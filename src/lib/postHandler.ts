
import type { Ref } from "vue"
import { ref } from "vue"
import { supabase } from '@/lib/supabaseClient'
import { authHandler } from '@/lib/authHandler'
import { uiHandler } from '@/lib/uiHandler'
import { type MediaRaw, mediaHandler } from "./mediaHandler"

const { shortAlert } = uiHandler()
const { user } = authHandler()
const { downloadMedia } = mediaHandler()
const disablePost = ref(false)
const newPost: Ref<PostMedia | undefined> = ref()
const posts_raw: Ref<MediaRaw[]> = ref([])
const posts: Ref<Post[]> = ref([])
const mosaic: Ref<Post[]> = ref([])

export interface Post {
    id: string
    title?: string
    caption?: string
    src: string
    type: string
    date: string
}

interface PostMedia {
    file: File
    type: string
    url: string
    title?: string
    caption?: string
}

async function selectPost(evt: Event) {

    const input = evt.target as HTMLInputElement
    const selectedFiles = input.files

    if (selectedFiles && selectedFiles[0]) {
        let postFile = selectedFiles[0]
        if (postFile.size > 50000000) {
            shortAlert(`media exceeds size limit of 50mb`)
        } else {
            newPost.value = {
                file: postFile,
                type: postFile.type.split('/')![0] as string,
                url: URL.createObjectURL(postFile)
            }
        }
    }
    input.value = ''
}

const addPost = async (evt: Event) => {
    if (!user.value) return
    disablePost.value = true
    const form = evt.target as HTMLFormElement

    if (newPost.value?.file) {
        let myPost = newPost.value
        const fileExt = myPost.file.name.split('.').pop()
        const filePath = `${Math.random()}.${fileExt}`
        const new_post: MediaRaw = {
            id: filePath,
            path: filePath,
            label: myPost.title,
            timeStamp: Date.now(),
            description: myPost.caption,
            type: myPost.type
        }
        try {
            const { error } = await supabase.storage.from('media').upload(filePath, myPost.file)
            if (error) throw error
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        }
        try {
            const { error } = await supabase.from('profiles').update({ posts: [...posts_raw.value, new_post] }).eq('id', user.value.id)
            if (error) throw error
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        }
        loadPosts()
    }

    newPost.value = undefined
    disablePost.value = false
    form.reset()
}

async function loadPosts() {
    if (!user.value) return

    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select('posts')
            .eq('id', user.value.id)
            .single()

        if (error && status !== 406) throw error
        if (data) {
            posts_raw.value = data.posts
        }
        if (!posts_raw.value) {
            posts_raw.value = []
        }
        posts.value = []
        for (const post of posts_raw.value) {
            try {
                const { data, error } = await supabase.storage.from('media').download(post.path)
                if (error) throw error
                const url = URL.createObjectURL(data)
                posts.value.push({
                    id: post.path,
                    src: url,
                    type: post.type,
                    date: post.date ?? 'may 22',
                    title: post.label,
                    caption: post.description
                })
            } catch (error) {
                if (error instanceof Error) alert(`${error.message} while downloading post media`)
            }
        }
        await downloadMedia()
    } catch (error) {
        if (error instanceof Error) alert(`${error.message} while loading posts`)
    }

    let mos0 = []
    let mos1 = []
    let mos2 = []
    for (let i = 0; i < posts.value.length; i++) {
        if ((i % 3) === 0) {
            mos0.push(posts.value[i] as Post)
        } else if ((i % 3) === 1) {
            mos1.push(posts.value[i] as Post)
        } else {
            mos2.push(posts.value[i] as Post)
        }
    }
    console.log(mos0)
    mosaic.value = mos0.concat(mos1, mos2)
}

export function postHandler() {
    return {
        mosaic,
        disablePost,
        newPost,
        addPost,
        selectPost,
        loadPosts
    }
}