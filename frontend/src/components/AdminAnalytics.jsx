import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { TrendingUp, Users, Eye, QrCode, Building2, Award, Activity } from 'lucide-react';
import axios from 'axios';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    categoryWise: [],
    shopWise: [],
    overall: {
      totalOffers: 0,
      totalViews: 0,
      totalSaves: 0,
      totalScans: 0,
      activeShops: 0,
      totalUsers: 0
    },
    monthlyTrends: [],
    topPerformingShops: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  const fetchAdminAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      const mockData = {
        categoryWise: [
          { category: 'Food & Dining', offers: 145, views: 12500, saves: 1200, scans: 450, engagement: 9.6 },
          { category: 'Fashion', offers: 98, views: 8900, saves: 890, scans: 320, engagement: 10.1 },
          { category: 'Electronics', offers: 76, views: 7200, saves: 650, scans: 280, engagement: 9.0 },
          { category: 'Services', offers: 67, views: 6100, saves: 580, scans: 210, engagement: 9.5 },
          { category: 'Health & Beauty', offers: 54, views: 4800, saves: 420, scans: 180, engagement: 9.4 }
        ],
        shopWise: [
          { shopName: 'Pizza Palace', offers: 12, views: 2400, saves: 240, scans: 89, category: 'Food', rating: 4.8 },
          { shopName: 'Fashion Hub', offers: 15, views: 2100, saves: 210, scans: 76, category: 'Fashion', rating: 4.6 },
          { shopName: 'Tech World', offers: 8, views: 1800, saves: 180, scans: 65, category: 'Electronics', rating: 4.7 },
          { shopName: 'Beauty Salon', offers: 10, views: 1600, saves: 160, scans: 58, category: 'Services', rating: 4.5 },
          { shopName: 'Grocery Mart', offers: 18, views: 2200, saves: 220, scans: 82, category: 'Food', rating: 4.4 }
        ],
        overall: {
          totalOffers: 440,
          totalViews: 47100,
          totalSaves: 4340,
          totalScans: 1580,
          activeShops: 127,
          totalUsers: 2850
        },
        monthlyTrends: [
          { month: 'Jan', offers: 120, views: 8500, saves: 780, scans: 285 },
          { month: 'Feb', offers: 135, views: 9200, saves: 850, scans: 310 },
          { month: 'Mar', offers: 148, views: 10100, saves: 920, scans: 340 },
          { month: 'Apr', offers: 165, views: 11200, saves: 1020, scans: 375 },
          { month: 'May', offers: 178, views: 12100, saves: 1100, scans: 405 }
        ],
        topPerformingShops: [
          { shopName: 'Pizza Palace', score: 95, offers: 12, engagement: 12.3 },
          { shopName: 'Fashion Hub', score: 89, offers: 15, engagement: 11.8 },
          { shopName: 'Tech World', score: 87, offers: 8, engagement: 11.5 },
          { shopName: 'Grocery Mart', score: 85, offers: 18, engagement: 11.2 },
          { shopName: 'Beauty Salon', score: 82, offers: 10, engagement: 10.9 }
        ]
      };

      // Uncomment when backend API is ready
      // const response = await axios.get('http://localhost:8080/api/admin/analytics');
      // setAnalytics(response.data);

      setAnalytics(mockData);
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0000'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex gap-2 mb-6">
        {['overview', 'categories', 'shops', 'trends'].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === view
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Cards */}
      {selectedView === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Offers</p>
                  <p className="text-3xl font-bold">{analytics.overall.totalOffers.toLocaleString()}</p>
                </div>
                <Award className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Views</p>
                  <p className="text-3xl font-bold">{analytics.overall.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">QR Scans</p>
                  <p className="text-3xl font-bold">{analytics.overall.totalScans.toLocaleString()}</p>
                </div>
                <QrCode className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Active Shops</p>
                  <p className="text-3xl font-bold">{analytics.overall.activeShops.toLocaleString()}</p>
                </div>
                <Building2 className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Total Users</p>
                  <p className="text-3xl font-bold">{analytics.overall.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100">Engagement Rate</p>
                  <p className="text-3xl font-bold">
                    {((analytics.overall.totalSaves / analytics.overall.totalViews) * 100).toFixed(1)}%
                  </p>
                </div>
                <Activity className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Monthly Trends Overview */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Monthly Performance Trends
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="offers" fill="#8884d8" name="Offers" />
                <Line yAxisId="right" type="monotone" dataKey="views" stroke="#82ca9d" strokeWidth={3} name="Views" />
                <Line yAxisId="right" type="monotone" dataKey="scans" stroke="#ff7300" strokeWidth={3} name="Scans" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Category-wise Analytics */}
      {selectedView === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Category-wise Performance
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.categoryWise} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="offers" fill="#8884d8" name="Offers" />
                <Bar dataKey="views" fill="#82ca9d" name="Views" />
                <Bar dataKey="scans" fill="#ffc658" name="Scans" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryWise}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="offers"
                  >
                    {analytics.categoryWise.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Engagement by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.categoryWise}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="engagement" fill="#ff7300" name="Engagement %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Shop-wise Analytics */}
      {selectedView === 'shops' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-purple-600" />
              Top Performing Shops
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.topPerformingShops}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shopName" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" name="Performance Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" fill="#82ca9d" name="Engagement %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Shop Performance Details</h3>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Shop Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Offers</th>
                  <th className="px-4 py-2 text-left">Views</th>
                  <th className="px-4 py-2 text-left">Saves</th>
                  <th className="px-4 py-2 text-left">Scans</th>
                  <th className="px-4 py-2 text-left">Rating</th>
                </tr>
              </thead>
              <tbody>
                {analytics.shopWise.map((shop, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{shop.shopName}</td>
                    <td className="px-4 py-2">{shop.category}</td>
                    <td className="px-4 py-2">{shop.offers}</td>
                    <td className="px-4 py-2">{shop.views.toLocaleString()}</td>
                    <td className="px-4 py-2">{shop.saves.toLocaleString()}</td>
                    <td className="px-4 py-2">{shop.scans.toLocaleString()}</td>
                    <td className="px-4 py-2">⭐ {shop.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trends Analytics */}
      {selectedView === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-indigo-600" />
              Growth Trends Over Time
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="offers"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Offers"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  name="Views"
                />
                <Area
                  type="monotone"
                  dataKey="saves"
                  stackId="3"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.6}
                  name="Saves"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Scan vs Save Ratio</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="saves"
                    stroke="#8884d8"
                    strokeWidth={3}
                    name="Saves"
                  />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="#ff7300"
                    strokeWidth={3}
                    name="Scans"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Monthly Growth Rate</h3>
              <div className="space-y-4">
                {analytics.monthlyTrends.map((month, index) => {
                  if (index === 0) return null;
                  const prevMonth = analytics.monthlyTrends[index - 1];
                  const growth = ((month.offers - prevMonth.offers) / prevMonth.offers * 100).toFixed(1);
                  return (
                    <div key={month.month} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{month.month}</span>
                      <span className={`font-bold ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth > 0 ? '+' : ''}{growth}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;