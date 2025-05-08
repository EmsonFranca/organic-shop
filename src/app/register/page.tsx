/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, ArrowLeft } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validação básica
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    // Simulação de registro - em uma aplicação real, isso seria feito com uma API
    try {
      // Verificar se o usuário já existe
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userExists = users.some((user: any) => user.email === formData.email && user.type === formData.userType)

      if (userExists) {
        setError("Este email já está registrado para este tipo de usuário")
        return
      }

      // Adicionar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.userType,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Inicializar dados para o usuário
      if (formData.userType === "customer") {
        const customers = JSON.parse(localStorage.getItem("customers") || "[]")
        customers.push({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          orders: [],
        })
        localStorage.setItem("customers", JSON.stringify(customers))
      } else if (formData.userType === "manager") {
        // Garantir que as listas de produtos, clientes e pedidos existam
        if (!localStorage.getItem("products")) {
          localStorage.setItem("products", JSON.stringify([]))
        }

        if (!localStorage.getItem("customers")) {
          localStorage.setItem("customers", JSON.stringify([]))
        }

        if (!localStorage.getItem("orders")) {
          localStorage.setItem("orders", JSON.stringify([]))
        }
      }

      setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...")

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("Erro ao cadastrar. Tente novamente.")
      console.error(err)
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

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">Verde Vivo</h1>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Criar uma conta</h2>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
          )}

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
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Seu nome completo"
              />
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

            <div className="mb-4">
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

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Cadastrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
