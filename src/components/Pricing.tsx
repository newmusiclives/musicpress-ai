"use client";
import { CheckCircle, Zap, Star, Building2 } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic PR tools",
    icon: Zap,
    color: "border-border",
    buttonStyle: "bg-surface border border-border text-foreground hover:bg-surface-light",
    features: [
      "50 contact searches / month",
      "1 AI press release / month",
      "Basic journalist database",
      "1 campaign at a time",
      "TrueFans CONNECT basic link",
      "Community support",
    ],
  },
  {
    name: "Artist Pro",
    price: "$29",
    period: "/ month",
    description: "For serious independent artists",
    icon: Star,
    color: "border-primary glow-primary",
    popular: true,
    buttonStyle: "bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-90",
    features: [
      "Unlimited contact searches",
      "20 AI press releases / month",
      "Full journalist + curator database",
      "Unlimited campaigns",
      "AI pitch personalization",
      "EPK builder included",
      "Campaign analytics",
      "1,000 CSV exports / month",
      "TrueFans CONNECT full integration",
      "Pitch request alerts",
      "Email support",
    ],
  },
  {
    name: "Venue / Label",
    price: "$79",
    period: "/ month",
    description: "For venues, labels, and agencies",
    icon: Building2,
    color: "border-accent",
    buttonStyle: "bg-gradient-to-r from-accent to-success text-white hover:opacity-90",
    features: [
      "Everything in Artist Pro",
      "Unlimited press releases",
      "5 team members included",
      "Venue-specific PR tools",
      "White-label press kits",
      "Wholesale distribution pricing",
      "5,000 CSV exports / month",
      "TrueFans CONNECT venue dashboard",
      "Priority pitch request matching",
      "Custom media rooms",
      "API access",
      "Dedicated account manager",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready to go bigger. No hidden
            fees, no long-term contracts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-surface rounded-2xl border ${plan.color} p-6 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <plan.icon className="w-5 h-5 text-primary" />
                  <span className="font-bold">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-sm text-foreground/50">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-foreground/50 mt-1">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={`block text-center font-semibold text-sm py-3 rounded-xl transition-all ${plan.buttonStyle}`}
              >
                {plan.price === "$0" ? "Get Started Free" : "Start 14-Day Trial"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
