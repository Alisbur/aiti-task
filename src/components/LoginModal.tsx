import { useMutation } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { dummyLogin } from '@/api/dummyjson'
import { useAuthStore } from '@/store/authStore'

type LoginFormValues = {
  username: string
  password: string
  rememberMe: boolean
}

export default function LoginModal() {
  const setToken = useAuthStore((s) => s.setToken)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '', rememberMe: false },
    mode: 'onSubmit',
  })

  const loginMutation = useMutation({
    mutationFn: async (input: { username: string; password: string }) =>
      dummyLogin({ username: input.username, password: input.password }),
  })
  const errorMessage =
    loginMutation.error instanceof Error ? loginMutation.error.message : null

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    loginMutation.mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: (tokens) => {
          setToken(tokens.accessToken, data.rememberMe)
        },
      }
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-semibold text-slate-900">
            Добро пожаловать!
          </div>
          <div className="text-sm text-slate-500">
            Пожалуйста, авторизируйтесь
          </div>
        </div>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-left">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Логин
            </label>
            <input
              {...register('username', {
                validate: (v) => (v.trim() ? true : 'Поле обязательно'),
              })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
              autoComplete="username"
            />
            {errors.username?.message ? (
              <div className="mt-1 text-xs text-red-600">
                {errors.username.message}
              </div>
            ) : null}
          </div>

          <div className="text-left">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Пароль
            </label>
            <input
              type="password"
              {...register('password', {
                validate: (v) => (v.trim() ? true : 'Поле обязательно'),
              })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
              autoComplete="current-password"
            />
            {errors.password?.message ? (
              <div className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </div>
            ) : null}
          </div>

          <label className="flex items-center gap-2 self-start text-sm text-slate-700">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Запомнить данные
          </label>

          {errorMessage ? (
            <div className="text-sm text-red-600">{errorMessage}</div>
          ) : null}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? 'Вход...' : 'Войти'}
          </button>

          <div className="text-sm text-slate-600">
            Нет аккаунта?{' '}
            <button
              type="button"
              className="font-medium text-indigo-700 hover:text-indigo-800"
              onClick={() => {
                // Ссылка-заглушка (по ТЗ)
              }}
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
