
import type { Ref } from "vue"
import { ref } from "vue"
import { supabase } from '@/lib/supabaseClient'
import { authHandler } from '@/lib/authHandler'
import { uiHandler } from '@/lib/uiHandler'
import type { MediaRaw } from '@/lib/types'

const { shortAlert } = uiHandler()
const disablePost = ref(false)
const newPost: Ref<PostMedia | undefined> = ref()
const postViewable: Ref<Post | undefined> = ref()

export interface Post {
    id: string
    label?: string
    description?: string
    url: string
    type: string
    date: string
    coverUrl?: string
}

interface PostMedia {
    file: File
    type: string
    url: string
    label?: string
    description?: string
    coverFile?: File
}

function viewPost(post: Post, view: boolean) {
    if (view) {
        postViewable.value = post
    } else {
        postViewable.value = undefined
    }
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
    const { user } = authHandler()
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
            label: myPost.label,
            timeStamp: Date.now(),
            description: myPost.description,
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
            const { data, error } = await supabase.from('profiles').select('posts').eq('id', user.value.id)
            if (error) throw error
            try {
                const { error } = await supabase.from('profiles').update({ posts: [new_post, ...data] }).eq('id', user.value.id)
                if (error) throw error
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message)
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        }

    }

    newPost.value = undefined
    disablePost.value = false
    form.reset()
}

export function postHandler() {
    return {
        disablePost,
        newPost,
        postViewable,
        addPost,
        selectPost,
        viewPost
    }
}