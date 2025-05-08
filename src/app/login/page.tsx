"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, ArrowLeft } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Simulação de login - em uma aplicação real, isso seria feito com uma API
    if (formData.email && formData.password) {
      // Verificar se o usuário existe no localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = users.find((u: any) => u.email === formData.email && u.type === formData.userType)

      if (user && user.password === formData.password) {
        // Login bem-sucedido
        localStorage.setItem("currentUser", JSON.stringify(user))

        // Redirecionar com base no tipo de usuário
        if (formData.userType === "manager") {
          // Adicionar um pequeno atraso para garantir que o localStorage seja atualizado
          setTimeout(() => {
            router.push("/manager/dashboard")
          }, 100)
        } else {
          router.push("/customer/dashboard")
        }
      } else {
        setError("Email ou senha incorretos")
      }
    } else {
      setError("Por favor, preencha todos os campos")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <header className="container mx-auto py-6 px-4">
        <Link href="/" className="flex items-center gap-2 text-green-800 hover:text-green-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar para a página inicial</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">Verde Vivo</h1>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Entrar no sistema</h2>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="userType" className="block text-gray-700 font-medium mb-2">
                Tipo de usuário
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="customer">Cliente</option>
                <option value="manager">Gerente</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="seu@email.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-green-600 hover:text-green-700">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
