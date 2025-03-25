import React from 'react';
import { FaChartLine, FaPercentage, FaChartBar, FaBox, FaMoneyBillWave, FaShoppingBag } from "react-icons/fa";

const InsightsSection = ({ 
  conversionRate, 
  profitRate, 
  revenue, 
  orders, 
  selectedMonth, 
  onMonthChange 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <ConversionCard conversionRate={conversionRate} orders={orders} />
      <ProfitCard profitRate={profitRate} revenue={revenue} />
      <ProductAnalysisCard 
        orders={orders} 
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
      />
    </div>
  );
};

const ConversionCard = ({ conversionRate, orders }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-indigo-100 rounded-lg">
        <FaChartLine className="text-indigo-500 text-xl" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">Tỷ lệ chuyển đổi</h3>
        <p className="text-sm text-gray-500">Đơn hoàn thành/Tổng đơn</p>
      </div>
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-indigo-600">{conversionRate}%</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-sm text-gray-500">
          {orders.filter(order => order.status === "Completed").length} / {orders.length} đơn
        </span>
      </div>
    </div>
  </div>
);

const ProfitCard = ({ profitRate, revenue }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-green-100 rounded-lg">
        <FaPercentage className="text-green-500 text-xl" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">Lợi nhuận</h3>
        <p className="text-sm text-gray-500">Doanh thu - Chi phí</p>
      </div>
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-green-600">{profitRate}%</p>
      <ProfitBreakdown revenue={revenue} />
    </div>
  </div>
);

const ProductAnalysisCard = ({ orders, selectedMonth, onMonthChange }) => {
  const monthlyOrders = orders.filter(order => {
    if (!order.orderDate) return false;
    const orderDate = new Date(order.orderDate);
    return orderDate.getMonth() === selectedMonth;
  });

  // Tính toán 2 thông tin cơ bản
  const monthlyStats = {
    // Thống kê đơn hàng cơ bản
    totalOrders: monthlyOrders.length,
    completedOrders: monthlyOrders.filter(order => order.status === "Completed").length,
    totalRevenue: monthlyOrders.reduce((sum, order) => sum + (order.finalAmount || 0), 0),
    totalItems: monthlyOrders.reduce((sum, order) => 
      sum + (order.orderItems?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0), 0),
    
    // Thêm thống kê mới
    pendingOrders: monthlyOrders.filter(order => order.status === "Pending").length,
    paidOrders: monthlyOrders.filter(order => order.paymentStatus === "Confirmed").length,
    averageOrderValue: monthlyOrders.length > 0 
      ? monthlyOrders.reduce((sum, order) => sum + (order.finalAmount || 0), 0) / monthlyOrders.length 
      : 0,
  };

  const productStats = monthlyOrders.reduce((acc, order) => {
    order.orderItems?.forEach(item => {
      const existingProduct = acc.find(p => p.productId === item.product.id);
      if (existingProduct) {
        existingProduct.quantity += item.quantity;
        existingProduct.revenue += item.price * item.quantity;
        existingProduct.orderCount += 1;
        existingProduct.averagePrice = existingProduct.revenue / existingProduct.quantity;
      } else {
        acc.push({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
          orderCount: 1,
          averagePrice: item.price
        });
      }
    });
    return acc;
  }, []);

  const sortedProducts = productStats.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FaChartBar className="text-orange-500 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Phân tích sản phẩm</h3>
            <p className="text-sm text-gray-500">
              Tháng {selectedMonth + 1}/{new Date().getFullYear()}
            </p>
          </div>
        </div>
        
        <select 
          className="text-sm border rounded-lg px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors"
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
          value={selectedMonth}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>Tháng {i + 1}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FaShoppingBag className="text-blue-500" />
            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
          </div>
          <p className="text-xl font-semibold text-gray-800">
            {monthlyStats.totalOrders} đơn
          </p>
          <div className="flex flex-col text-xs text-gray-500 mt-1">
            <span className="text-green-600">
              {monthlyStats.completedOrders} hoàn thành
            </span>
            <span className="text-yellow-600">
              {monthlyStats.pendingOrders} đang xử lý
            </span>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FaMoneyBillWave className="text-purple-500" />
            <p className="text-sm text-gray-600">Doanh thu</p>
          </div>
          <p className="text-xl font-semibold text-gray-800">
            {formatCurrency(monthlyStats.totalRevenue)}
          </p>
          <div className="flex flex-col text-xs text-gray-500 mt-1">
            <span>TB {formatCurrency(monthlyStats.averageOrderValue)}/đơn</span>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FaPercentage className="text-yellow-500" />
            <p className="text-sm text-gray-600">Thanh toán</p>
          </div>
          <p className="text-xl font-semibold text-gray-800">
            {monthlyStats.paidOrders} đơn
            <span className="text-sm text-green-600 ml-2">
              ({((monthlyStats.paidOrders / monthlyStats.totalOrders) * 100 || 0).toFixed(1)}%)
            </span>
          </p>
          <div className="flex flex-col text-xs text-gray-500 mt-1">
            <span className="text-red-600">
              {monthlyStats.totalOrders - monthlyStats.paidOrders} chưa thanh toán
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 overflow-x-auto">
        {sortedProducts.map((product, index) => (
          <ProductItem 
            key={product.productId}
            product={product}
            index={index}
            totalRevenue={monthlyStats.totalRevenue}
          />
        ))}
      </div>
    </div>
  );
};

const ProductItem = ({ product, index, totalRevenue }) => (
  <div className="relative p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <span className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
          ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
            index === 1 ? 'bg-gray-100 text-gray-700' :
            index === 2 ? 'bg-orange-100 text-orange-700' :
            'bg-blue-50 text-blue-700'}
        `}>
          #{index + 1}
        </span>
        <div>
          <h4 className="font-medium text-gray-800">{product.productName}</h4>
          <p className="text-xs text-gray-500">Mã SP: {product.productId}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(product.revenue)}
        </p>
        <p className="text-xs text-gray-500">Doanh thu</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 mb-3">
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-xs text-gray-500">Số lượng bán</p>
        <p className="font-medium text-gray-900">{product.quantity}</p>
      </div>
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-xs text-gray-500">Số đơn hàng</p>
        <p className="font-medium text-gray-900">{product.orderCount}</p>
      </div>
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-xs text-gray-500">Giá TB/SP</p>
        <p className="font-medium text-gray-900">{formatCurrency(product.averagePrice)}</p>
      </div>
    </div>

    <div className="relative pt-2">
      <div className="text-xs text-gray-500 mb-1">
        Tỷ trọng doanh thu: {((product.revenue / totalRevenue) * 100).toFixed(1)}%
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500
            ${index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-500' :
              index === 2 ? 'bg-orange-500' :
              'bg-blue-500'}
          `}
          style={{ width: `${(product.revenue / totalRevenue) * 100}%` }}
        />
      </div>
    </div>
  </div>
);

const ProfitBreakdown = ({ revenue }) => (
  <div className="flex flex-col gap-1 mt-2">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">Doanh thu:</span>
      <span className="text-sm font-medium text-gray-700">
        {formatCurrency(revenue)}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">Chi phí ước tính:</span>
      <span className="text-sm font-medium text-gray-700">
        {formatCurrency(revenue * 0.7)}
      </span>
    </div>
    <div className="flex items-center justify-between pt-2 border-t">
      <span className="text-sm text-gray-500">Lợi nhuận:</span>
      <span className="text-sm font-medium text-green-600">
        {formatCurrency(revenue * 0.3)}
      </span>
    </div>
  </div>
);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default InsightsSection;