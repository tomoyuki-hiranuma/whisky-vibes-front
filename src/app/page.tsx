"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * Whisky Vibes – ポップ＆ユーザーフレンドリー版
 * 明るく楽しい雰囲気で、誰でも直感的に操作できるように再設計。
 * スマホ中心デザイン・アニメーション強化・色使いをポップに。
 */

interface Recommendation {
	name: string;
	keywords: string[];
	price: string;
}

interface AnalyzeResult {
	style_name: string;
	description: string;
	order_phrase: string;
	recommendations?: Recommendation[];
}

const MOODS = [
	{ label: "リラックス", color: "bg-pink-200", emoji: "🌿" },
	{ label: "元気出したい", color: "bg-yellow-200", emoji: "⚡" },
	{ label: "甘い気分", color: "bg-orange-200", emoji: "🍯" },
	{ label: "大人な夜", color: "bg-blue-200", emoji: "🌙" },
];

export default function WhiskyVibesPop() {
	const [minPrice, setMinPrice] = useState<number | "">("");
	const [maxPrice, setMaxPrice] = useState<number | "">("");
	const [result, setResult] = useState<AnalyzeResult | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const buildSearchUrl = (site: "amazon" | "rakuten", q: string) => {
		const encoded = encodeURIComponent(q);
		return site === "amazon"
			? `https://www.amazon.co.jp/s?k=${encoded}`
			: `https://search.rakuten.co.jp/search/mall/${encoded}/`;
	};

	const mockAnalyze = async (
		mood: string,
		min: number | "",
		max: number | "",
	): Promise<AnalyzeResult> => {
		await new Promise((r) => setTimeout(r, 700));
		const rec: Record<string, Recommendation[]> = {
			リラックス: [
				{
					name: "グレンフィディック 12年",
					keywords: ["スペイサイド", "ライト"],
					price: "6000",
				},
				{
					name: "グレンリベット 12年",
					keywords: ["フルーティ", "やさしい"],
					price: "5500",
				},
			],
			元気出したい: [
				{
					name: "ワイルドターキー 101",
					keywords: ["バーボン", "スパイシー"],
					price: "3500",
				},
				{
					name: "ブレット ライ",
					keywords: ["ライウイスキー", "スパイス"],
					price: "4000",
				},
			],
			甘い気分: [
				{
					name: "アベラワー 12 ダブルカスク",
					keywords: ["シェリー", "バニラ"],
					price: "7000",
				},
				{
					name: "グレンモーレンジィ オリジナル",
					keywords: ["バニラ", "シトラス"],
					price: "6000",
				},
			],
			大人な夜: [
				{
					name: "ラフロイグ 10年",
					keywords: ["アイラ", "ピート"],
					price: "7000",
				},
				{
					name: "アードベッグ 10年",
					keywords: ["ピート", "スモーク"],
					price: "8000",
				},
			],
		};

		const base = rec[mood] || [];
		const filtered = base.filter((item) => {
			const num = parseInt(item.price, 10);
			if (min && num < min) return false;
			if (max && num > max) return false;
			return true;
		});

		return {
			style_name: `${mood}なあなたにおすすめ✨`,
			description: `${min ? `${min}円〜` : ""}${max ? `${max}円` : ""}で楽しめる、ポップで美味しいウイスキーはこちら！`,
			order_phrase: `${mood}気分にぴったりなウイスキーを見つけました。`,
			recommendations: filtered.length ? filtered : base,
		};
	};

	const handleSelect = async (mood: string) => {
		if (isLoading) return;
		setIsLoading(true);
		const res = await mockAnalyze(mood, minPrice, maxPrice);
		setResult(res);
		setIsLoading(false);
	};

	const reset = () => {
		setResult(null);
		setMinPrice("");
		setMaxPrice("");
	};

	return (
		<main className="mx-auto max-w-screen-sm px-4 py-8">
			<AnimatePresence mode="wait">
				{!result && (
					<motion.div
						key="input"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						className="space-y-6"
					>
						<Card className="shadow-lg border-amber-100 bg-white/80">
							<CardHeader>
								<CardTitle className="text-xl text-center text-amber-800">
									あなたの気分からAIがウイスキーを提案します！
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col sm:flex-row gap-3 items-center justify-center">
								<Input
									type="number"
									min={0}
									value={minPrice}
									onChange={(e) =>
										setMinPrice(
											e.target.value ? parseInt(e.target.value, 10) : "",
										)
									}
									placeholder="最小"
									className="text-center h-12 w-32 text-lg border-amber-200"
								/>
								<span className="text-lg font-medium text-gray-500">〜</span>
								<Input
									type="number"
									min={0}
									value={maxPrice}
									onChange={(e) =>
										setMaxPrice(
											e.target.value ? parseInt(e.target.value, 10) : "",
										)
									}
									placeholder="最大"
									className="text-center h-12 w-32 text-lg border-amber-200"
								/>
							</CardContent>
						</Card>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							{MOODS.map((m) => (
								<motion.button
									key={m.label}
									whileTap={{ scale: 0.95 }}
									onClick={() => handleSelect(m.label)}
									className={`${m.color} p-4 sm:p-5 rounded-2xl shadow-md hover:shadow-lg transition-all text-center flex flex-col items-center justify-center h-24 sm:h-28 text-base font-medium text-gray-800`}
									disabled={isLoading}
								>
									<span className="text-2xl sm:text-3xl mb-1">{m.emoji}</span>
									{m.label}
								</motion.button>
							))}
						</div>
					</motion.div>
				)}

				{result && (
					<motion.div
						key="result"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						className="space-y-6"
					>
						<Card className="shadow-lg border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-xl text-amber-900">
									<Sparkles className="h-5 w-5 text-amber-600" />{" "}
									{result.style_name}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<p className="text-gray-700 leading-relaxed text-base">
									{result.description}
								</p>
								<div className="p-4 rounded-xl bg-white border text-center text-sm">
									<div className="text-xs text-gray-500 mb-1">
										バーで伝える一言
									</div>
									<p className="font-semibold text-gray-800">
										{result.order_phrase}
									</p>
								</div>
							</CardContent>
							<CardFooter className="flex justify-center">
								<Button
									variant="default"
									onClick={reset}
									className="bg-amber-500 hover:bg-amber-600 text-white text-base px-6 py-2 rounded-full"
								>
									🔄 もう一回やってみる
								</Button>
							</CardFooter>
						</Card>

						{result.recommendations && result.recommendations.length > 0 && (
							<div className="grid gap-4 sm:grid-cols-2">
								{result.recommendations.map((item, i) => {
									const query = `${item.name} ${item.keywords.join(" ")}`;
									return (
										<motion.div
											key={item.name}
											whileHover={{ scale: 1.02 }}
											className="p-4 rounded-2xl bg-white/90 border border-amber-100 shadow-sm hover:shadow-md transition-all"
										>
											<h3 className="font-bold text-amber-900 text-base mb-1">
												{i + 1}. {item.name}
											</h3>
											<p className="text-xs text-gray-500 mb-1">
												{item.keywords.join(" / ")}
											</p>
											<p className="text-sm text-gray-700 mb-3">
												約 {item.price}円
											</p>
											<div className="flex gap-2">
												<Button
													asChild
													className="flex-1 bg-orange-400 hover:bg-orange-500 text-white rounded-full"
												>
													<a
														href={buildSearchUrl("amazon", query)}
														target="_blank"
														rel="noopener noreferrer"
													>
														Amazon
													</a>
												</Button>
												<Button
													asChild
													variant="secondary"
													className="flex-1 rounded-full"
												>
													<a
														href={buildSearchUrl("rakuten", query)}
														target="_blank"
														rel="noopener noreferrer"
													>
														楽天
													</a>
												</Button>
											</div>
										</motion.div>
									);
								})}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
