import AnnouncementsBoard from "@/components/AnnouncementsBoard";
import TopPerformerBanner from "@/components/TopPerformerBanner";
import { ArrowRight, BarChart3, BookOpen, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3 animate-fade-in">
        <FeatureLink
          to="/scorecards"
          icon={BarChart3}
          label="Scorecards"
          text="Track weekly performance, quality, attendance, and achievement."
          color="bg-gradient-mint text-mint-foreground"
        />
        <FeatureLink
          to="/macros"
          icon={MessageSquareText}
          label="Macros"
          text="Grab quick-response scripts for the conversations that repeat."
          color="bg-gradient-bubblegum text-bubblegum-foreground"
        />
        <FeatureLink
          to="/handbook"
          icon={BookOpen}
          label="Handbook"
          text="Keep policy notes, SOPs, and escalation guidance close."
          color="bg-gradient-sunny text-sunny-foreground"
        />
      </section>

      <div className="animate-fade-in stagger-1">
        <TopPerformerBanner />
      </div>
      <div className="animate-fade-in stagger-2">
        <AnnouncementsBoard />
      </div>
    </div>
  );
};

type FeatureLinkProps = {
  to: string;
  icon: typeof BarChart3;
  label: string;
  text: string;
  color: string;
};

const FeatureLink = ({ to, icon: Icon, label, text, color }: FeatureLinkProps) => (
  <Link
    to={to}
    className={`group rounded-2xl p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-pop ${color}`}
  >
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-soft">
      <Icon className="h-6 w-6" />
    </div>
    <h2 className="text-xl font-extrabold tracking-tight">{label}</h2>
    <p className="mt-2 text-sm font-semibold leading-6 opacity-80">{text}</p>
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
      Open
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </span>
  </Link>
);

export default Index;
