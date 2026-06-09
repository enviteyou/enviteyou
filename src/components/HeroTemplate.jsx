'use client'
import Templates from "@/components/Templates";
import Category from "@/components/Category";
import { useState } from "react";

export default function HeroTemplate({ templates = [] }) {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <section id="how-it-works" className="relative isolate overflow-hidden bg-white text-black">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06),transparent_68%)] blur-3xl" />
                <div className="absolute -right-32 top-24 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.22),transparent_70%)] blur-3xl" />
                {/* <div className="absolute -bottom-40 left-1/2 h-104 w-104 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_66%)] blur-3xl" /> */}
            </div>

            <div className="mx-auto flex  w-full flex-col px-5 pb-0 md:px-10">
                <div className="order-3 border-t border-black/10">
                    <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-10 md:py-10">
                        <div className="mb-5 flex md:justify-center justify-start">
                            <div className="rounded-sm border  border-black/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-black/70">
                                New Releases
                            </div>
                        </div>
                        <h2 className="mx-auto max-w-3xl text-center md:text-left text-xl font-bold leading-tight tracking-tight text-black sm:text-3xl">
                            Built for your big day. Simple to edit. Just type, save, and share.
                        </h2>
                        <p className="mx-auto mt-3 max-w-3xl text-center md:text-left text-sm text-black/60">
                            Select your theme. Tell your story. Send it in minutes.
                        </p>
                    </div>
                    <Category activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                    <Templates templates={templates} activeCategory={activeCategory} />
                </div>
            </div>
        </section>
    );
}