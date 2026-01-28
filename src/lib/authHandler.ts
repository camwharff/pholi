import type { User } from "@supabase/supabase-js"
import { ref } from 'vue'
import { supabase } from "@/lib/supabaseClient"
import router from "@/router"
import { useUserStore } from "@/stores/user"
import { nullPholi } from "@/lib/mediaHandler"

type Mode = 'SIGNUP' | 'LOGIN' | 'MANAGE'

const user = ref<User | null>(null)
const success = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)
const mode = ref('SIGNUP' as Mode)

async function changeMode(newMode: Mode) {
    mode.value = newMode
}

async function loadUser() {
    const {
        data: { user: currentUser }
    } = await supabase.auth.getUser()
    user.value = currentUser
}

async function signOut() {
    if (!user.value) {
        router.push({ name: 'home' })
        return
    }
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        await loadUser()
        router.push({ name: 'home' })
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

const handleLogin = async (email: string, password: string) => {
    error.value = null
    isLoading.value = true
    try {
        const { error: supabaseError, data } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (supabaseError) throw supabaseError
        if (!data.user) throw new Error("User data not found")
        const userStore = useUserStore()
        console.log(data.user.id)
        await userStore.loadUserData(data.user.id)
        await loadUser()
        router.push({ name: 'account' })
        success.value = true
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}

const handleSignUp = async (email: string, password: string, repeatPassword: string, username: string, full_name: string) => {
    error.value = null

    if (password !== repeatPassword) {
        error.value = "Passwords do not match"
        return
    }

    isLoading.value = true
    try {
        const { error: supabaseError, data } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: full_name,
                    username: username,
                    avatar_url: '',
                    bio: '',
                    media: {},
                    pholi: nullPholi,
                    posts: {}
                }
            }
        })
        if (supabaseError) throw supabaseError
        if (!data.user) throw new Error("User data not found")
        const userStore = useUserStore()
        await userStore.loadUserData(data.user.id)
        await loadUser()
        router.push({ name: 'account' })
        success.value = true
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}

async function handleForgotPassword(e: Event) {
    isLoading.value = true
    error.value = null
    e.preventDefault()
    const formInput = e.target as HTMLFormElement
    console.log(formInput)
    const email = (formInput.querySelector('input[name="email"]') as HTMLInputElement).value

    try {
        const { error: supabaseError } =
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`
            })

        if (supabaseError) throw supabaseError
        success.value = true
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}

async function handleUpdatePassword(e: Event) {
    isLoading.value = true
    error.value = null
    const formInput = e.target as HTMLFormElement
    const password = (formInput.querySelector('input[name="password"]') as HTMLInputElement).value
    const repeatPassword = (formInput.querySelector('input[name="repeatPassword"]') as HTMLInputElement).value

    if (password !== repeatPassword) {
        error.value = "Passwords do not match"
        return
    }

    try {
        const { error: supabaseError } = await supabase.auth.updateUser({
            password: password,
        })
        if (supabaseError) throw supabaseError
        await loadUser()
        router.push({ name: 'account' })
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}

function openSettings() {

}

export function authHandler() {
    return {
        user,
        error,
        success,
        isLoading,
        mode,
        changeMode,
        loadUser,
        signOut,
        handleLogin,
        handleSignUp,
        handleForgotPassword,
        handleUpdatePassword,
        openSettings
    }
}
