import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// Define the expected raw data types based on the existing codebase
interface Order {
  id: string;
  customer_name: string;
  phone_number: string;
  delivery_location: string;
  payment_method: "onDelivery" | "transfer";
  status: "pending" | "ordered" | "delivered" | "canceled";
  payment_status: "pending" | "accepted" | "rejected";
  payment_screenshot: string;
  created_at: string;
}

interface ExtendedOrderItem {
  id: string;
  order_id: string;
  poster_id: string;
  poster_size: string;
  quantity: number;
  unit_price: number;
  poster_name: string; // From poster.name join
  category_name: string; // From category.name join (via poster.category_id)
}

interface OrderStatisticsChartsProps {
  orders: Order[];
  orderItems: ExtendedOrderItem[];
  title?: string;
  chartHeight?: number;
}

const OrderStatisticsCharts: React.FC<OrderStatisticsChartsProps> = ({
  orders,
  orderItems,
  title = "Order Statistics",
  chartHeight = 300,
}) => {
  // Color palette matching admin theme
  const colors = {
    amber: "#fbbf24",
    green: "#34d399",
    red: "#ef4444",
    blue: "#3b82f6",
    yellow: "#facc15",
    gray: "#6b7280",
  };
  // Helper function to group array by a derived string key
  const groupBy = <T,>(array: T[], getKey: (item: T) => string) => {
    return array.reduce(
      (result, item) => {
        const groupKey = getKey(item);
        if (!result[groupKey]) {
          result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
      },
      {} as Record<string, T[]>,
    );
  };

  const formatCurrency = (
    value: number | string | readonly (number | string)[] | undefined,
  ) => {
    const resolvedValue = Array.isArray(value) ? value[0] : value;
    const numericValue =
      typeof resolvedValue === "number"
        ? resolvedValue
        : Number(resolvedValue ?? 0);
    const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
    return `${safeValue.toFixed(2)} Birr`;
  };

  // 1. Revenue Trend Data (Line Chart)
  // Calculate revenue per order, then group by date
  const revenueByOrder = orders.map((order) => {
    const orderItemsForOrder = orderItems.filter(
      (item) => item.order_id === order.id,
    );
    const totalRevenue = orderItemsForOrder.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );
    return {
      date: order.created_at.split("T")[0], // Extract YYYY-MM-DD
      revenue: totalRevenue,
    };
  });

  const revenueChartData = Object.entries(
    groupBy(revenueByOrder, (entry) => entry.date),
  )
    .map(([date, entries]) => ({
      date,
      revenue: entries.reduce((sum, entry) => sum + entry.revenue, 0),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 2. Order Status Distribution (Pie Chart)
  const statusChartData = Object.entries(
    groupBy(orders, (order) => order.status),
  ).map(([status, entries]) => ({
    status,
    count: entries.length,
  }));

  // 3. Top Selling Posters (Bar Chart) - by quantity sold
  const postersGrouped = groupBy(orderItems, (item) => item.poster_name);
  const topPostersChartData = Object.entries(postersGrouped)
    .map(([posterName, items]) => ({
      posterName,
      quantitySold: items.reduce((sum, item) => sum + item.quantity, 0),
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 10); // Top 10

  // 4. Sales by Category (Bar Chart) - by revenue
  const categoriesGrouped = groupBy(orderItems, (item) => item.category_name);
  const salesByCategoryChartData = Object.entries(categoriesGrouped)
    .map(([categoryName, items]) => ({
      categoryName,
      revenue: items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0,
      ),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6 w-full ">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Revenue Trend - Line Chart */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-lg font-medium text-white mb-4">Revenue Trend</h3>
          {revenueChartData.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              No revenue data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart
                data={revenueChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#zinc-800/20" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#f5f5f5", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  tick={{ fill: "#f5f5f5", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  wrapperStyle={{ pointerEvents: "none" }}
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid #zinc-700",
                    color: "white",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                  labelStyle={{ color: "white", fontSize: 12 }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={colors.amber}
                  strokeWidth={2}
                  dot={{ r: 4, fill: colors.amber }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Status - Pie Chart */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-lg font-medium text-white mb-4">
            Order Status Distribution
          </h3>
          {statusChartData.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              No order status data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  labelLine={{
                    stroke: colors.amber,
                    strokeWidth: 1,
                  }}
                  label={{
                    position: "inside",
                    fill: "#zinc-900",
                    fontSize: 12,
                  }}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index % 4 === 0
                          ? colors.green
                          : index % 4 === 1
                            ? colors.amber
                            : index % 4 === 2
                              ? colors.red
                              : colors.blue
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Posters - Bar Chart */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-lg font-medium text-white mb-4">
            Top Selling Posters
          </h3>
          {topPostersChartData.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              No poster sales data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={topPostersChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="posterName"
                  tick={{ fill: "#zinc-400", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#zinc-400", fontSize: 12 }} />
                <Tooltip
                  wrapperStyle={{ pointerEvents: "none" }}
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid #zinc-700",
                    color: "white",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                  labelStyle={{ color: "white", fontSize: 12 }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="quantitySold"
                  fill={colors.green}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sales by Category - Bar Chart */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-lg font-medium text-white mb-4">
            Sales by Category
          </h3>
          {salesByCategoryChartData.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              No category sales data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={salesByCategoryChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="categoryName"
                  tick={{ fill: "#zinc-400", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#zinc-400", fontSize: 12 }} />
                <Tooltip
                  wrapperStyle={{ pointerEvents: "none" }}
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid #zinc-700",
                    color: "white",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                  labelStyle={{ color: "white", fontSize: 12 }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="revenue"
                  fill={colors.blue}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStatisticsCharts;
