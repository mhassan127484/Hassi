"use server";

import * as api from "@/lib/api/products";
import { Product, Category } from "@/types";

export async function getProducts(): Promise<Product[]> {
  return api.getProducts();
}

export async function getCategories() {
  return api.getCategories();
}

export async function getBestSellers(): Promise<Product[]> {
  return api.getBestSellers();
}

export async function getNewArrivals(): Promise<Product[]> {
  return api.getNewArrivals();
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  return api.getProductsByCategory(category);
}

export async function searchProducts(query: string): Promise<Product[]> {
  return api.searchProducts(query);
}
