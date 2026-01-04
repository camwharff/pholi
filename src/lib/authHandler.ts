import type { Session } from "@supabase/supabase-js"
import { ref } from 'vue'
import { supabase } from "./supabaseClient"
import router from "@/router"

type Mode = 'SIGNUP' | 'LOGIN' | 'MANAGE'

const session = ref<Session | null>(null)
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

async function loadSession() {
    const {
        data: { session: currentSession }
    } = await supabase.auth.getSession()

    session.value = currentSession
}

async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        router.push({ name: 'auth' })
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

async function handleLogin() {
    error.value = null

    isLoading.value = true
    try {
        const { error: supabaseError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (supabaseError) throw supabaseError
        window.location.href = "/"
        success.value = true
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}

async function handleSignUp() {
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
        if (supabaseError) throw supabaseError
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

export function authHandler() {
    return {
        session,
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
        loadSession,
        signOut,
        handleLogin,
        handleSignUp,
        handleForgotPassword,
        handleUpdatePassword
    }
}

// should not be used, password updates should go through the email
async function handleUpdatePassword() {
    isLoading.value = true
    error.value = null

    try {
        const { error: supabaseError } = await supabase.auth.updateUser({
            password: password.value,
        })
        if (supabaseError) throw supabaseError
        location.href = "/protected"
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}