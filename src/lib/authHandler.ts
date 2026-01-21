import type { User } from "@supabase/supabase-js"
import { ref } from 'vue'
import { supabase } from "./supabaseClient"
import router from "@/router"

type Mode = 'SIGNUP' | 'LOGIN' | 'MANAGE'

const user = ref<User | null>(null)
const success = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)
const email = ref('')
const password = ref('')
const full_name = ref('')
const username = ref('')
const repeatPassword = ref("")
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

const handleLogin = async () => {
    error.value = null
    isLoading.value = true
    try {
        const { error: supabaseError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (supabaseError) throw supabaseError
        await loadUser()
        router.push({ name: 'account' })
        success.value = true
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}

const handleSignUp = async () => {
    error.value = null

    if (password.value !== repeatPassword.value) {
        error.value = "Passwords do not match"
        return
    }

    isLoading.value = true
    try {
        const { error: supabaseError } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                data: {
                    full_name: full_name.value,
                    username: username.value
                }
            }
        })
        console.log()
        if (supabaseError) throw supabaseError
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
    e.preventDefault()
    isLoading.value = true
    error.value = null

    try {
        const { error: supabaseError } =
            await supabase.auth.resetPasswordForEmail(email.value, {
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

async function handleUpdatePassword() {
    isLoading.value = true
    error.value = null

    try {
        const { error: supabaseError } = await supabase.auth.updateUser({
            password: password.value,
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
        email,
        password,
        full_name,
        username,
        repeatPassword,
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
