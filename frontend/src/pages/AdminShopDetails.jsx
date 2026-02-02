import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";

export default function AdminShopDetails(){
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetch = async ()=>{
      setLoading(true);
      try{
        const res = await axios.get(`http://localhost:8080/api/admin/shops/${id}`);
        setShop(res.data);
      }catch(e){
        setShop({
          id: 1,
          shopName: "Local Pizza",
          ownerName: "Ahmed Khan",
          email: "pizza@example.com",
          area: "Downtown",
          category: "Food",
          address: "123 Main St",
          registrationStatus: "APPROVED",
          mobileNumber: "+911234567890"
        });
      }finally{
        setLoading(false);
      }
    };
    fetch();
  },[id]);

  if(loading) return <div className="p-6">Loading shop...</div>;
  if(!shop) return <div className="p-6">Shop not found</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Shop Details — {shop.shopName}</h2>
        <Link to="/admin" className="text-sm text-blue-600">Back to Admin</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Shop ID</p>
          <p className="font-semibold">#{shop.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Owner</p>
          <p className="font-semibold">{shop.ownerName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-semibold">{shop.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Area</p>
          <p className="font-semibold">{shop.area}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Documents & Status</h3>
        <p className="text-sm text-gray-600">Status: <span className="font-semibold">{shop.registrationStatus}</span></p>
        <p className="text-sm text-gray-600">Address: <span className="font-semibold">{shop.address}</span></p>
        <p className="text-sm text-gray-600">Mobile: <span className="font-semibold">{shop.mobileNumber}</span></p>
      </div>
    </div>
  );
}
