"use client";
import { FaStar } from "react-icons/fa6"; // pastikan import benar
import Link from "next/link";
import { useEffect, useState } from "react";
import { BtnIconToggle, RegularCardSkeleton } from ".";
import { formatToRupiah } from "@/utils";
import { DataReview } from "@/data";
import { getAverageRating } from "@/utils";

export function FlashSaleCard({ item: raw }) {
  // stop kalau item belum ada
  if (!raw) return null;

  // Normalisasi & fallback data agar aman
  const item = {
    id: raw.id ?? raw._id ?? crypto.randomUUID(),
    name: raw.name ?? raw.productName ?? raw.title ?? "Unnamed Product",
    // ambil harga prioritas: price → realprice → salePrice → prices[0] → 0
    price: Number(
      raw.price ??
        raw.realprice ??
        raw.salePrice ??
        (Array.isArray(raw.prices) ? raw.prices[0] : undefined) ??
        0
    ),
    // harga banding (kalau ada) untuk strike-through
    compareAt: Number(
      raw.realprice ??
        raw.oldPrice ??
        (Array.isArray(raw.prices) ? raw.prices[1] : undefined) ??
        NaN
    ),
    image:
      raw.image ??
      (Array.isArray(raw.images) ? raw.images[0] : null) ??
      "/placeholder.png",
    rating: Number(raw.rating ?? raw.stars ?? 0),
    brand: raw.brand ?? raw.brandName ?? "",
    category: raw.category ?? "",
    slug:
      raw.slug ??
      (raw.name || raw.productName
        ? (raw.name || raw.productName).toLowerCase().replace(/\s+/g, "-")
        : `item-${Math.random().toString(36).slice(2)}`),
    sale: Boolean(raw.sale), // opsional
  };

  const hasSale =
    Number.isFinite(item.compareAt) && item.compareAt > item.price;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product];
    });
  };

  const isWishlisted = wishlist.some((p) => p.id === item.id);

  const reviewsForProduct = Array.isArray(DataReview)
    ? DataReview.filter((r) => r.productID === item.id)
    : [];
  const averageRating = getAverageRating(reviewsForProduct);

  if (loading) return <RegularCardSkeleton />;

  return (
    <div className="container group relative rounded-lg bg-white h-auto w-[200px] space-y-4 transition-all overflow-hidden">
      <Link href={`/product-detail/${item.slug}`}>
        <div className="image flex w-full items-center justify-center relative">
          {(item.sale || hasSale) && (
            <img
              src="/sale-tag.svg"
              alt="Sale"
              className="absolute top-0 left-0 z-10 w-[40px] h-auto"
            />
          )}

          <div className="absolute top-4 right-4 z-10">
            <BtnIconToggle
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlist(item);
              }}
              iconName="Heart"
              variant="tertiary"
              size="md"
            />
          </div>

          <div className="image object-cover">
            <img
              src={item.image}
              alt={item.name}
              className="w-[150px] h-auto"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>
        </div>

        <div className="content-wrapper w-full space-y-2 p-4">
          <div className="category-and-name space-y-1">
            <div className="text-sm font-bold text-neutral-950 line-clamp-2">
              {item.name}
            </div>
          </div>

          <div className="price flex items-center space-x-2">
            {hasSale ? (
              <>
                <div className="text-sm font-bold text-primary-700">
                  {formatToRupiah(item.price)}
                </div>
                <div className="text-xs font-medium text-neutral-400 line-through">
                  {formatToRupiah(item.compareAt)}
                </div>
              </>
            ) : (
              <div className="text-base font-bold text-primary-700">
                {formatToRupiah(item.price)}
              </div>
            )}
          </div>

          <div className="rating flex space-x-2 h items-center">
            <div className="flex space-x-1 items-center">
              {averageRating === 0 ? (
                <span className="text-xs text-primary-700 font-light">
                  No rating
                </span>
              ) : (
                <div className="flex items-center space-x-1 font-bold text-primary-700 text-xs">
                  <span>{averageRating}</span>
                  <FaStar className="h-[12px] w-[12px] text-warning-300" />
                </div>
              )}
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-400" />
            <div className="text-xs font-light text-neutral-300">
              ({reviewsForProduct.length} reviews)
            </div>
          </div>

          <div className="text-xs category-brand flex flex-row relative items-center space-x-1.5 overflow-hidden h-6">
            <p className="text-neutral-400 transition-transform duration-300 group-hover:-translate-y-6">
              {item.category || "—"}
            </p>
            <p className="text-neutral-400 absolute top-0 left-0 translate-y-6 transition-transform duration-300 group-hover:translate-y-0">
              {item.brand || "—"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
