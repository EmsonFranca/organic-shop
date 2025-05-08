/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Package, Users, ShoppingBag, LogOut, Plus, Check, Truck, X } from "lucide-react"
import Image from "next/image"

export default function ManagerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")
  const [products, setProducts] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
  })
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    // Verificar se o usuário está logado e é um gerente
    const userStr = localStorage.getItem("currentUser")
    if (!userStr) {
      console.log("Usuário não encontrado, redirecionando para login")
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userStr)
      console.log("Usuário carregado:", user)

      if (user.type !== "manager") {
        console.log("Usuário não é gerente, redirecionando para login")
        router.push("/login")
        return
      }

      setCurrentUser(user)

      // Inicializar dados se não existirem
      if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify([]))
      }

      if (!localStorage.getItem("customers")) {
        localStorage.setItem("customers", JSON.stringify([]))
      }

      if (!localStorage.getItem("orders")) {
        localStorage.setItem("orders", JSON.stringify([]))
      }

      // Carregar dados do localStorage
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
      const storedCustomers = JSON.parse(localStorage.getItem("customers") || "[]")
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")

      setProducts(storedProducts)
      setCustomers(storedCustomers)
      setOrders(storedOrders)
    } catch (error) {
      console.error("Erro ao processar dados do usuário:", error)
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Por favor, preencha os campos obrigatórios")
      return
    }

    const productToAdd = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      description: newProduct.description,
      stock: Number.parseInt(newProduct.stock),
      image: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(newProduct.name)}`,
    }

    const updatedProducts = [...products, productToAdd]
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Resetar formulário
    setNewProduct({
      name: "",
      category: "",
      price: "",
      description: "",
      stock: "",
    })
    setShowAddProduct(false)
  }

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      const updatedProducts = products.filter((product) => product.id !== productId)
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))
    }
  }

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      const updatedCustomers = customers.filter((customer) => customer.id !== customerId)
      setCustomers(updatedCustomers)
      localStorage.setItem("customers", JSON.stringify(updatedCustomers))
    }
  }

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    try {
      // Atualizar o status do pedido
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        }
        return order
      })

      // Atualizar o estado e o localStorage
      setOrders(updatedOrders)
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Se estiver visualizando os detalhes do pedido, atualizar o pedido selecionado
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        })
      }

      alert(`Status do pedido atualizado para: ${getStatusLabel(newStatus)}`)
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error)
      alert("Erro ao atualizar status do pedido. Tente novamente.")
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Entregue"
      case "processing":
        return "Em processamento"
      case "cancelled":
        return "Cancelado"
      default:
        return "Pendente"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
            className={`w-full flex items-center gap-3 px-4 py-3 ${activeTab === "products" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <Package className="h-5 w-5" />
            <span>Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`w-full flex items-center gap-3 px-4 py-3 ${activeTab === "customers" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <Users className="h-5 w-5" />
            <span>Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 ${activeTab === "orders" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Vendas</span>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Produto</span>
              </button>
            </div>

            {showAddProduct && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Adicionar Novo Produto</h3>
                <form onSubmit={handleAddProduct}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                        Categoria
                      </label>
                      <input
                        type="text"
                        id="category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-gray-700 font-medium mb-1">
                        Estoque *
                      </label>
                      <input
                        type="number"
                        id="stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Salvar Produto
                    </button>
                  </div>
                </form>
              </div>
            )}

            {products.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">Nenhum produto cadastrado. Adicione seu primeiro produto!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estoque
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.category || "-"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">R$ {product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.stock}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Clientes</h2>

            {customers.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pedidos
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.orders?.length || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Vendas</h2>

            {orders.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">Nenhuma venda registrada ainda.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID do Pedido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id.slice(-6)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">R$ {order.total.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewOrderDetails(order)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Detalhes
                            </button>
                            <div className="relative group">
                              <button className="text-green-600 hover:text-green-900">Atualizar Status</button>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Truck className="h-4 w-4 mr-2" />
                                    Em processamento
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Entregue
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancelado
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-green-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Detalhes do Pedido #{selectedOrder.id.slice(-6)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedOrder.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                  <button onClick={() => setShowOrderDetails(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Informações do Cliente</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Nome:</span> {selectedOrder.customerName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">ID do Cliente:</span> {selectedOrder.customerId}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Itens do Pedido</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items.map((item: any, index: number) => (
                          <tr key={item.productId || index}>
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
                              <div className="text-sm text-gray-900">{item.quantity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total do Pedido</span>
                    <p className="text-xl font-bold text-green-700">R$ {selectedOrder.total.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "processing")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                    >
                      <Truck className="h-4 w-4" />
                      Em processamento
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "completed")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                    >
                      <Check className="h-4 w-4" />
                      Entregue
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "cancelled")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                      Cancelado
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-end">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
