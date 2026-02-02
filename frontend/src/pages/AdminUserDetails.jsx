import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";

export default function AdminUserDetails(){
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetch = async ()=>{
      setLoading(true);
      try{
        const res = await axios.get(`http://localhost:8080/api/admin/users/${id}`);
        setUser(res.data);
      }catch(e){
        // fallback demo data
        setUser({
          id: 999,
          name: "Demo User",
          email: "demo.user@example.com",
          role: "user",
          accountVisits: 42,
          profileViews: 128,
          likesCount: 27,
          bookmarksCount: 12,
          shopsVisited: 9,
          engagementScore: 76,
          bookmarkedShops: [],
          viewedOffers: [],
          pastOffers: []
        });
      }finally{
        setLoading(false);
      }
    };
    fetch();
  },[id]);

  if(loading) return <div className="p-6">Loading user...</div>;
  if(!user) return <div className="p-6">User not found</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">User Details — {user.name}</h2>
        <Link to="/admin" className="text-sm text-blue-600">Back to Admin</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">User ID</p>
          <p className="font-semibold">#{user.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-semibold">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Role</p>
          <p className="font-semibold">{user.role}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Account Visits</p>
          <p className="font-semibold">{user.accountVisits || 0}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Connected Shops</h3>
        {user.bookmarkedShops && user.bookmarkedShops.length>0 ? (
          user.bookmarkedShops.map(s=> (
            <div key={s.id} className="border p-3 rounded mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{s.shopName}</p>
                  <p className="text-xs text-gray-600">{s.area} — {s.category}</p>
                </div>
                <Link to={`/admin/shops/${s.id}`} className="text-sm text-blue-600">Open Shop</Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No connected shops</p>
        )}
      </div>
    </div>
  );
}
