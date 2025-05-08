/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Leaf, User, ShoppingBag, LogOut, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"

export default function CustomerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Verificar se o usuário está logado e é um cliente
      const userStr = localStorage.getItem("currentUser")
      if (!userStr) {
        console.log("Usuário não encontrado, redirecionando para login")
        router.push("/login")
        return
      }

      const user = JSON.parse(userStr)
      console.log("Usuário carregado:", user)

      if (user.type !== "customer") {
        console.log("Usuário não é cliente, redirecionando para login")
        router.push("/login")
        return
      }

      setCurrentUser(user)

      // Inicializar dados se não existirem
      if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify([]))
      }

      if (!localStorage.getItem("orders")) {
        localStorage.setItem("orders", JSON.stringify([]))
      }

      // Carregar dados do localStorage
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")

      // Filtrar apenas os pedidos do cliente atual
      const userOrders = storedOrders.filter((order: any) => order.customerId === user.id)

      // Verificar se existe um carrinho para o usuário
      const userCart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || "[]")

      setProducts(storedProducts)
      setOrders(userOrders)
      setCart(userCart)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao processar dados do usuário:", error)
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const addToCart = (product: any) => {
    try {
      // Verificar se o produto já está no carrinho
      const existingItem = cart.find((item) => item.productId === product.id)

      let updatedCart
      if (existingItem) {
        // Atualizar quantidade
        updatedCart = cart.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        // Adicionar novo item
        updatedCart = [
          ...cart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
          },
        ]
      }

      setCart(updatedCart)
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(updatedCart))

      toast.success(`${product.name} adicionado ao carrinho!`)
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
      alert("Erro ao adicionar produto ao carrinho. Tente novamente.")
    }
  }

  const removeFromCart = (productId: string) => {
    try {
      const updatedCart = cart.filter((item) => item.productId !== productId)
      setCart(updatedCart)
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(updatedCart))
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error)
      alert("Erro ao remover produto do carrinho. Tente novamente.")
    }
  }

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) return

      const updatedCart = cart.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))

      setCart(updatedCart)
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(updatedCart))
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error)
      alert("Erro ao atualizar quantidade. Tente novamente.")
    }
  }

  const checkout = () => {
    try {
      if (!cart || cart.length === 0) {
        alert("Seu carrinho está vazio!")
        return
      }

      if (!currentUser || !currentUser.id) {
        alert("Erro: Informações do usuário não disponíveis. Faça login novamente.")
        router.push("/login")
        return
      }

      // Calcular total
      const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)

      // Criar novo pedido
      const newOrder = {
        id: Date.now().toString(),
        customerId: currentUser.id,
        customerName: currentUser.name || "Cliente",
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name || "Produto",
          price: item.price || 0,
          quantity: item.quantity || 0,
          image: item.image || "/placeholder.svg",
        })),
        total: total,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      // Atualizar pedidos no localStorage
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const updatedOrders = [...allOrders, newOrder]
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Atualizar pedidos do cliente
      setOrders([...orders, newOrder])

      // Limpar carrinho
      setCart([])
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify([]))

      // Atualizar estoque dos produtos
      const updatedProducts = products.map((product) => {
        const cartItem = cart.find((item) => item.productId === product.id)
        if (cartItem) {
          return {
            ...product,
            stock: Math.max(0, product.stock - (cartItem.quantity || 0)),
          }
        }
        return product
      })

      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      toast.success("Pedido realizado com sucesso!")
      setActiveTab("orders")
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error)
      alert("Erro ao finalizar pedido. Tente novamente.")
    }
  }

  const calculateCartTotal = () => {
    try {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    } catch (error) {
      console.error("Erro ao calcular total:", error)
      return 0
    }
  }

  // Mostrar mensagem de carregamento enquanto os dados estão sendo carregados
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white min-h-screen">
        <div className="p-4 flex items-center gap-2">
          <Leaf className="h-6 w-6" />
          <h1 className="text-xl font-bold">Verde Vivo</h1>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              activeTab === "products" ? "bg-green-700" : "hover:bg-green-700"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab("cart")}
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              activeTab === "cart" ? "bg-green-700" : "hover:bg-green-700"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Carrinho {cart.length > 0 && `(${cart.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              activeTab === "orders" ? "bg-green-700" : "hover:bg-green-700"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Meus Pedidos</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              activeTab === "profile" ? "bg-green-700" : "hover:bg-green-700"
            }`}
          >
            <User className="h-5 w-5" />
            <span>Meu Perfil</span>
          </button>
        </div>

        <div className="mt-auto p-4 border-t border-green-700">
          {currentUser && (
            <div className="mb-4">
              <p className="text-sm text-green-300">Logado como:</p>
              <p className="font-medium">{currentUser.name}</p>
            </div>
          )}

          <button onClick={handleLogout} className="flex items-center gap-2 text-green-300 hover:text-white">
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Disponíveis</h2>

            {products.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">Nenhum produto disponível no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    
                    
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={1920}
                      height={1080}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1 text-green-800">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.category || "Orgânico"}</p>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-bold">R$ {product.price.toFixed(2)}</span>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className={`text-sm px-3 py-1 rounded ${
                            product.stock > 0
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          } transition-colors`}
                        >
                          {product.stock > 0 ? "Adicionar" : "Esgotado"}
                        </button>
                      </div>
                      {product.stock > 0 && <p className="text-sm text-gray-500 mt-1">Estoque: {product.stock}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === "cart" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Meu Carrinho</h2>

            {cart.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">Seu carrinho está vazio.</p>
                <button
                  onClick={() => setActiveTab("products")}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Ver produtos
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cart.map((item) => (
                        <tr key={item.productId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <Image
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={40}
                                  height={40}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">R$ {item.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                                className="px-2 py-1 border border-gray-300 rounded-l-md"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 border-t border-b border-gray-300">{item.quantity}</span>
                              <button
                                onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                                className="px-2 py-1 border border-gray-300 rounded-r-md"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-green-700">R$ {calculateCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={checkout}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Finalizar Pedido
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Meus Pedidos</h2>

            {orders.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
                <button
                  onClick={() => setActiveTab("products")}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Ver produtos
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">Pedido #{order.id ? order.id.slice(-6) : "N/A"}</h3>
                          <p className="text-sm text-gray-500">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Data não disponível"}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status === "completed"
                              ? "Concluído"
                              : order.status === "processing"
                                ? "Em processamento"
                                : "Pendente"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Itens do pedido</h4>
                      {order.items && Array.isArray(order.items) ? (
                        <ul className="divide-y divide-gray-200">
                          {order.items.map((item: any, index: number) => (
                            <li key={item.productId || index} className="py-3 flex justify-between">
                              <div className="flex items-center">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name || "Produto"}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-full object-cover mr-3"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.name || "Produto sem nome"}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.quantity || 0} x R$ {(item.price || 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                R$ {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">Informações dos itens não disponíveis</p>
                      )}
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Total</span>
                        <span className="text-lg font-bold text-green-700">R$ {(order.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h2>

            <div className="bg-white rounded-lg shadow-md p-6">
              {currentUser && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="font-medium">{currentUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resumo da Conta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Total de Pedidos</p>
                        <p className="text-2xl font-bold text-green-700">{orders.length}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Itens no Carrinho</p>
                        <p className="text-2xl font-bold text-green-700">{cart.length}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Data de Cadastro</p>
                        <p className="text-sm font-medium text-green-700">
                          {new Date(currentUser.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
