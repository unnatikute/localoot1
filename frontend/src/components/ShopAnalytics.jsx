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
  AreaChart
} from 'recharts';
import axios from 'axios';
import { TrendingUp, Users, Eye, QrCode, Calendar, Award } from 'lucide-react';

const ShopAnalytics = ({ shopkeeperId }) => {
  const [analytics, setAnalytics] = useState({
    monthlyOffers: [],
    yearlyOffers: [],
    categoryStats: [],
    qrScans: [],
    engagement: {
      totalViews: 0,
      totalSaves: 0,
      totalScans: 0,
      engagementRate: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [shopkeeperId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      const mockData = {
        monthlyOffers: [
          { month: 'Jan', offers: 12, views: 245, saves: 23, scans: 8 },
          { month: 'Feb', offers: 15, views: 312, saves: 31, scans: 12 },
          { month: 'Mar', offers: 18, views: 387, saves: 42, scans: 15 },
          { month: 'Apr', offers: 22, views: 456, saves: 51, scans: 18 }
        ],
        yearlyOffers: [
          { year: '2023', offers: 45, views: 1200, saves: 120, scans: 45 },
          { year: '2024', offers: 67, views: 1800, saves: 180, scans: 67 },
          { year: '2025', offers: 89, views: 2100, saves: 210, scans: 89 }
        ],
        categoryStats: [
          { name: 'Food', value: 35, color: '#8884d8' },
          { name: 'Fashion', value: 25, color: '#82ca9d' },
          { name: 'Electronics', value: 20, color: '#ffc658' },
          { name: 'Services', value: 20, color: '#ff7300' }
        ],
        qrScans: [
          { date: '2024-01', scans: 12 },
          { date: '2024-02', scans: 18 },
          { date: '2024-03', scans: 25 },
          { date: '2024-04', scans: 32 }
        ],
        engagement: {
          totalViews: 1400,
          totalSaves: 147,
          totalScans: 53,
          engagementRate: 10.5
        }
      };

      // Uncomment when backend API is ready
      // const response = await axios.get(`http://localhost:8080/api/analytics/shop/${shopkeeperId}`);
      // setAnalytics(response.data);

      setAnalytics(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
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
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Views</p>
              <p className="text-2xl font-bold">{analytics.engagement.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Saved Offers</p>
              <p className="text-2xl font-bold">{analytics.engagement.totalSaves.toLocaleString()}</p>
            </div>
            <Award className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">QR Scans</p>
              <p className="text-2xl font-bold">{analytics.engagement.totalScans.toLocaleString()}</p>
            </div>
            <QrCode className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Engagement Rate</p>
              <p className="text-2xl font-bold">{analytics.engagement.engagementRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Offers Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.monthlyOffers}>
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
              />
              <Area
                type="monotone"
                dataKey="views"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categoryStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* QR Scans Trend */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <QrCode className="h-5 w-5 mr-2 text-purple-600" />
            QR Scan Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.qrScans}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="scans"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Overview */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-orange-600" />
            Yearly Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.yearlyOffers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="offers" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="views" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              <Bar dataKey="scans" fill="#ffc658" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ShopAnalytics;