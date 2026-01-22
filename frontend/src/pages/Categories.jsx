import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../store/auth.jsx";
import { createApi } from "../api/client.js";
import TrendingBanner from "../components/TrendingBanner.jsx";
import OfferCard from "../components/OfferCard.jsx";
import AreaFilter from "../components/AreaFilter.jsx";
import { useStats } from "../store/stats.jsx";

export default function Categories() {
  const { token } = useAuth();
  const api = useMemo(() => createApi(token), [token]);

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [trending, setTrending] = useState([]);
  const [topOffers, setTopOffers] = useState([]);
  const [offers, setOffers] = useState([]);
  // Hardcoded areas as fallback
  const FALLBACK_AREAS = [
    { id: 1, name: "Hinjewadi", city: "Pune" },
    { id: 2, name: "Wakad", city: "Pune" },
    { id: 3, name: "Baner", city: "Pune" },
    { id: 4, name: "Kothrud", city: "Pune" },
    { id: 5, name: "Viman Nagar", city: "Pune" },
    { id: 6, name: "Kharadi", city: "Pune" },
    { id: 7, name: "Shivajinagar", city: "Pune" },
    { id: 8, name: "Aundh", city: "Pune" },
    { id: 9, name: "Koregaon Park", city: "Pune" },
    { id: 10, name: "Hadapsar", city: "Pune" },
    { id: 11, name: "Magarpatta", city: "Pune" },
    { id: 12, name: "Balewadi", city: "Pune" },
    { id: 13, name: "Pashan", city: "Pune" },
    { id: 14, name: "Sus Road", city: "Pune" },
    { id: 15, name: "Bavdhan", city: "Pune" },
    { id: 16, name: "Katraj", city: "Pune" },
    { id: 17, name: "Kondhwa", city: "Pune" },
    { id: 18, name: "Wanowrie", city: "Pune" },
    { id: 19, name: "Camp", city: "Pune" },
    { id: 20, name: "Deccan", city: "Pune" },
    { id: 21, name: "FC Road", city: "Pune" },
    { id: 22, name: "JM Road", city: "Pune" },
    { id: 23, name: "Senapati Bapat Road", city: "Pune" },
    { id: 24, name: "Kalyani Nagar", city: "Pune" },
    { id: 25, name: "Yerwada", city: "Pune" },
    { id: 26, name: "Lohegaon", city: "Pune" },
    { id: 27, name: "Dhanori", city: "Pune" },
    { id: 28, name: "Wagholi", city: "Pune" },
    { id: 29, name: "Chandan Nagar", city: "Pune" },
    { id: 30, name: "Kharadi Bypass", city: "Pune" },
    { id: 31, name: "Mundhwa", city: "Pune" },
    { id: 32, name: "Keshav Nagar", city: "Pune" },
    { id: 33, name: "NIBM", city: "Pune" },
    { id: 34, name: "Mohammedwadi", city: "Pune" },
    { id: 35, name: "Hadaspar", city: "Pune" },
    { id: 36, name: "Manjri", city: "Pune" },
    { id: 37, name: "Lonikand", city: "Pune" },
    { id: 38, name: "Shivane", city: "Pune" },
    { id: 39, name: "Warje", city: "Pune" },
    { id: 40, name: "Karve Nagar", city: "Pune" },
    { id: 41, name: "Erandwane", city: "Pune" },
    { id: 42, name: "Model Colony", city: "Pune" },
    { id: 43, name: "Aundh Gaon", city: "Pune" },
    { id: 44, name: "Baner Gaon", city: "Pune" },
    { id: 45, name: "Pimple Saudagar", city: "Pune" },
    { id: 46, name: "Rahatani", city: "Pune" },
    { id: 47, name: "Wakad Gaon", city: "Pune" },
    { id: 48, name: "Tathawade", city: "Pune" },
  ];

  const [areas, setAreas] = useState(FALLBACK_AREAS);
  const [areaId, setAreaId] = useState("");
  const [areaQuery, setAreaQuery] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [filteredAreas, setFilteredAreas] = useState(FALLBACK_AREAS);
  const [searchAreaQuery, setSearchAreaQuery] = useState("");
  const stats = useStats();

  const FALLBACK_CATEGORIES = [
    {
      id: "mock-food",
      name: "Food & Dining",
      banner_image_url:
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1600&auto=format&fit=crop",
      _mock: true,
    },
    {
      id: "mock-fashion",
      name: "Fashion",
      banner_image_url:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop",
      _mock: true,
    },
    {
      id: "mock-electronics",
      name: "Electronics",
      banner_image_url:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      _mock: true,
    },
    {
      id: "mock-beauty",
      name: "Beauty & Wellness",
      banner_image_url:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      _mock: true,
    },
  ];

  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/categories");
        if (!mounted) return;
        const list =
          Array.isArray(data) && data.length ? data : FALLBACK_CATEGORIES;
        setCategories(list);
        setFilteredCategories(list);
        if (list.length) setSelectedCategory(list[0]);
      } catch (e) {
        if (!mounted) return;
        setError(e.response?.data?.message || "Failed to load categories");
        // fallback for flow demo
        setCategories(FALLBACK_CATEGORIES);
        setFilteredCategories(FALLBACK_CATEGORIES);
        setSelectedCategory(FALLBACK_CATEGORIES[0]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCats();
    return () => {
      mounted = false;
    };
  }, [api]);

  // Filter categories based on search
  useEffect(() => {
    if (!categorySearch.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categorySearch, categories]);

  useEffect(() => {
    let mounted = true;
    async function loadAreas() {
      try {
        const { data } = await api.get("/areas", { params: { city: "Pune" } });
        if (mounted) {
          const areasList =
            Array.isArray(data) && data.length > 0 ? data : FALLBACK_AREAS;
          setAreas(areasList);
          setFilteredAreas(areasList);
        }
      } catch (e) {
        console.error("Error loading areas:", e);
        // Use fallback areas if API fails
        if (mounted) {
          setAreas(FALLBACK_AREAS);
          setFilteredAreas(FALLBACK_AREAS);
        }
      }
    }
    loadAreas();
    return () => {
      mounted = false;
    };
  }, [api]);

  useEffect(() => {
    if (!searchAreaQuery.trim()) {
      setFilteredAreas(areas);
    } else {
      const filtered = areas.filter((area) =>
        area.name.toLowerCase().includes(searchAreaQuery.toLowerCase())
      );
      setFilteredAreas(filtered);
    }
  }, [searchAreaQuery, areas]);

  const handleAreaSearch = () => {
    if (searchAreaQuery.trim()) {
      // Try to find exact match first
      let foundArea = areas.find(
        (a) => a.name.toLowerCase() === searchAreaQuery.toLowerCase().trim()
      );
      // If no exact match, try partial match
      if (!foundArea) {
        foundArea = areas.find((a) =>
          a.name.toLowerCase().includes(searchAreaQuery.toLowerCase().trim())
        );
      }
      if (foundArea) {
        setAreaId(foundArea.id.toString());
        setAreaQuery(foundArea.name);
        setSearchAreaQuery(foundArea.name);
      } else {
        // Show message that area not found
        alert(
          `Area "${searchAreaQuery}" not found. Please select from the dropdown.`
        );
      }
    } else {
      setAreaId("");
      setAreaQuery("");
      setSearchAreaQuery("");
    }
  };

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (!selectedCategory) return;
      if (selectedCategory._mock) {
        // Mock shops with different areas
        const mockShops = [
          {
            id: "mock-shop-1",
            name: "Saras Restaurant",
            area: { id: 9, name: "Koregaon Park" },
            image_url:
              "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
            phone: "+91 98765 43210",
            address: "Koregaon Park, Pune",
            map_lat: 18.5345,
            map_lng: 73.9006,
          },
          {
            id: "mock-shop-2",
            name: "Domino's Pizza",
            area: { id: 2, name: "Wakad" },
            image_url:
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
            phone: "+91 98765 43211",
            address: "Wakad, Pune",
            map_lat: 18.5993,
            map_lng: 73.7625,
          },
          {
            id: "mock-shop-3",
            name: "Cafe Coffee Day",
            area: { id: 1, name: "Hinjewadi" },
            image_url:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop",
            phone: "+91 98765 43212",
            address: "Hinjewadi, Pune",
            map_lat: 18.5912,
            map_lng: 73.7389,
          },
          {
            id: "mock-shop-4",
            name: "Vaishali Restaurant",
            area: { id: 7, name: "Shivajinagar" },
            image_url:
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
            phone: "+91 98765 43213",
            address: "Shivajinagar, Pune",
            map_lat: 18.5314,
            map_lng: 73.8446,
          },
          {
            id: "mock-shop-5",
            name: "Pantaloons",
            area: { id: 3, name: "Baner" },
            image_url:
              "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
            phone: "+91 98765 43214",
            address: "Baner, Pune",
            map_lat: 18.5596,
            map_lng: 73.7864,
          },
          {
            id: "mock-shop-6",
            name: "Max Fashion",
            area: { id: 4, name: "Kothrud" },
            image_url:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
            phone: "+91 98765 43215",
            address: "Kothrud, Pune",
            map_lat: 18.5074,
            map_lng: 73.8077,
          },
        ];

        const mockOffers = [
          {
            id: "mock-offer-1",
            title: "Buy 1 Get 1 Free on Thali",
            description: `Pune: Koregaon Park - Valid on all Maharashtrian thalis. Offer valid till month end.`,
            image_url:
              "https://images.unsplash.com/photo-1550547660-8b00a1b7537f?q=80&w=800&auto=format&fit=crop",
            is_trending: true,
            shop: mockShops[0],
            categoryId: selectedCategory.id,
          },
          {
            id: "mock-offer-2",
            title: "50% Off on Large Pizzas",
            description: `Pune: Wakad - Weekend special on all large pizzas. Dine-in and delivery.`,
            image_url:
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
            is_trending: true,
            shop: mockShops[1],
            categoryId: selectedCategory.id,
          },
          {
            id: "mock-offer-3",
            title: "Flat ₹100 Off on Coffee Combos",
            description: `Pune: Hinjewadi - On all coffee and snack combos. Valid all day.`,
            image_url:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop",
            is_trending: false,
            shop: mockShops[2],
            categoryId: selectedCategory.id,
          },
          {
            id: "mock-offer-4",
            title: "30% Off on South Indian Breakfast",
            description: `Pune: Shivajinagar - Morning special from 8 AM to 11 AM. All items included.`,
            image_url:
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
            is_trending: true,
            shop: mockShops[3],
            categoryId: selectedCategory.id,
          },
          {
            id: "mock-offer-5",
            title: "Upto 70% Off on Summer Collection",
            description: `Pune: Baner - Massive discount on all summer wear. Limited stock.`,
            image_url:
              "https://images.unsplash.com/photo-1445205171083-17446d7c36f1?q=80&w=800&auto=format&fit=crop",
            is_trending: true,
            shop: mockShops[4],
            categoryId: selectedCategory.id,
          },
          {
            id: "mock-offer-6",
            title: "Buy 2 Get 1 Free on T-Shirts",
            description: `Pune: Kothrud - Spicy  n Tasty Food`,
            image_url:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
            is_trending: false,
            shop: mockShops[5],
            categoryId: selectedCategory.id,
          },
        ];

        // Filter by area if selected
        let filteredOffers = mockOffers;
        if (areaId) {
          filteredOffers = mockOffers.filter(
            (o) => o.shop.area?.id.toString() === areaId.toString()
          );
        }

        if (!mounted) return;
        setTrending(filteredOffers.filter((m) => m.is_trending));
        setTopOffers(filteredOffers.slice(0, 3));
        setOffers(filteredOffers);
        return;
      }
      try {
        const params = areaId ? { areaId } : {};
        const [t, top, o] = await Promise.all([
          api.get(`/categories/${selectedCategory.id}/trending`, { params }),
          api.get(`/categories/${selectedCategory.id}/top-offers`, { params }),
          api.get(`/categories/${selectedCategory.id}/offers`, { params }),
        ]);
        if (!mounted) return;
        setTrending(Array.isArray(t.data) ? t.data : []);
        setTopOffers(Array.isArray(top.data) ? top.data : []);
        setOffers(Array.isArray(o.data) ? o.data : []);
      } catch (e) {
        if (!mounted) return;
        console.error("Error loading offers:", e);
        setTrending([]);
        setTopOffers([]);
        setOffers([]);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [api, selectedCategory, areaId]);

  return (
    <div className="space-y-6">
      {loading && <p className="text-center py-8">Loading categories...</p>}
      {!loading && error && (
        <p className="text-red-600 bg-red-50 p-4 rounded">{error}</p>
      )}
      {!loading && !error && categories.length === 0 && (
        <p className="text-center py-8">
          No categories available. Try reseeding the backend and refresh.
        </p>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search Categories
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search categories by name..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
              />
              <button
                onClick={() => setCategorySearch("")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Filter by Area (Pune)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <AreaFilter
                    areas={areas}
                    value={areaId}
                    onChange={(val) => {
                      setAreaId(val);
                      if (val) {
                        const selectedArea = areas.find(
                          (a) => a.id.toString() === val
                        );
                        if (selectedArea) {
                          setSearchAreaQuery(selectedArea.name);
                          setAreaQuery(selectedArea.name);
                        }
                      } else {
                        setSearchAreaQuery("");
                        setAreaQuery("");
                      }
                    }}
                  />
                </div>
                {areaId && (
                  <button
                    onClick={() => {
                      setAreaId("");
                      setSearchAreaQuery("");
                      setAreaQuery("");
                    }}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium whitespace-nowrap"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Or search area by name (e.g., Hinjewadi, Wakad, Baner)..."
                  value={searchAreaQuery}
                  onChange={(e) => setSearchAreaQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAreaSearch();
                    }
                  }}
                  list="area-suggestions"
                />
                <datalist id="area-suggestions">
                  {filteredAreas.map((area) => (
                    <option key={area.id} value={area.name} />
                  ))}
                </datalist>
                <button
                  onClick={handleAreaSearch}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors whitespace-nowrap"
                >
                  🔍 Search
                </button>
              </div>
            </div>
            {areaId && (
              <p className="text-sm text-green-600 mt-2 font-medium">
                ✓ Showing offers from:{" "}
                <span className="font-bold">
                  {areas.find((a) => a.id.toString() === areaId)?.name ||
                    "Selected area"}
                </span>
              </p>
            )}
            {areas.length > 0 && !areaId && (
              <p className="text-xs text-gray-500 mt-1">
                {areas.length} areas available in Pune
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category Selection */}
      {filteredCategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Select Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c)}
                className={`relative rounded-lg border-2 overflow-hidden transition-all hover:scale-105 ${
                  selectedCategory?.id === c.id
                    ? "border-blue-600 shadow-lg ring-2 ring-blue-300"
                    : "border-gray-300 hover:border-blue-400"
                }`}
                title={c.name}
              >
                {c.banner_image_url && (
                  <div className="h-24 w-full overflow-hidden">
                    <img
                      src={c.banner_image_url}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`p-3 text-center ${
                    selectedCategory?.id === c.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <p className="text-sm font-semibold">{c.name}</p>
                </div>
                {selectedCategory?.id === c.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
          {filteredCategories.length === 0 && categorySearch && (
            <p className="text-gray-500 mt-4 text-center">
              No categories found matching "{categorySearch}"
            </p>
          )}
        </div>
      )}

      {/* Selected Category Banner */}
      {selectedCategory && (
        <TrendingBanner
          image={selectedCategory.banner_image_url}
          title={`${selectedCategory.name} - Best Offers${
            areaId
              ? ` in ${
                  areas.find((a) => a.id.toString() === areaId)?.name ||
                  "Selected Area"
                }`
              : ""
          }`}
          subtitle={
            areaId
              ? `${offers.length} offers available in ${
                  areas.find((a) => a.id.toString() === areaId)?.name ||
                  "selected area"
                }`
              : trending.length
              ? `${trending.length} trending offers available`
              : "Check back soon for hot offers"
          }
        />
      )}

      {/* Top 3 Offers Section */}
      {selectedCategory && topOffers.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-sm p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                🔥 Top 3 Offers
              </h2>
              <p className="text-gray-600 mt-1">
                Best deals in {selectedCategory.name}
                {areaId
                  ? ` in ${
                      areas.find((a) => a.id.toString() === areaId)?.name ||
                      "selected area"
                    }`
                  : " in Pune"}
              </p>
            </div>
            <span className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full font-semibold text-sm">
              Featured
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topOffers.map((o, index) => (
              <div key={o.id} className="relative">
                {index === 0 && (
                  <span className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                    1
                  </span>
                )}
                <OfferCard
                  offer={o}
                  onLike={async () => {
                    try {
                      await api.post(`/offers/${o.id}/like`);
                    } catch {}
                    stats.addLikedOffer(o);
                  }}
                  onBookmark={async () => {
                    try {
                      await api.post(`/offers/${o.id}/bookmark`);
                    } catch {}
                    stats.addBookmarkedOffer(o);
                  }}
                  linkState={{ offer: o, shop: o.shop }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Offers Section */}
      {selectedCategory && offers.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            All Offers in {selectedCategory.name}
            {areaId && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                -{" "}
                {areas.find((a) => a.id.toString() === areaId)?.name ||
                  "Selected Area"}
              </span>
            )}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {offers.map((o) => (
              <OfferCard
                key={o.id}
                offer={o}
                onLike={async () => {
                  try {
                    await api.post(`/offers/${o.id}/like`);
                  } catch {}
                  stats.addLikedOffer(o);
                }}
                onBookmark={async () => {
                  try {
                    await api.post(`/offers/${o.id}/bookmark`);
                  } catch {}
                  stats.addBookmarkedOffer(o);
                }}
                linkState={{ offer: o, shop: o.shop }}
              />
            ))}
          </div>
        </div>
      )}

      {selectedCategory && offers.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">
            No offers available in this category
            {areaId ? " for the selected area" : ""}.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try selecting a different category or area.
          </p>
        </div>
      )}
    </div>
  );
}
