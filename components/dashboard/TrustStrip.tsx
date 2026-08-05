import { UserIcon, ShieldCheckIcon, QuestionIcon, SendIcon } from "@/components/ui/icons";

const ITEMS = [
  { icon: UserIcon, title: "Trusted by Thousands", body: "Join thousands of candidates placed in GCC roles." },
  { icon: ShieldCheckIcon, title: "100% Transparent", body: "No hidden charges. Clear process at every step." },
  { icon: QuestionIcon, title: "End to End Support", body: "From profile to deployment, we are with you." },
  { icon: SendIcon, title: "Faster Opportunities", body: "AI matching connects you with the right jobs faster." },
] as const;

// Static marketing copy, matching the "trusted by thousands" framing used
// elsewhere on the public site — not candidate-specific data.
export default function TrustStrip() {
  return (
    <div className="trust-strip">
      {ITEMS.map((item) => (
        <div key={item.title} className="trust-item">
          <span className="trust-ic">
            <item.icon className="icon" />
          </span>
          <div>
            <h5>{item.title}</h5>
            <p>{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
