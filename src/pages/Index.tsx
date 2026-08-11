import AnnouncementsBoard from "@/components/AnnouncementsBoard";
import TopPerformerBanner from "@/components/TopPerformerBanner";
import { ArrowRight, BarChart3, BookOpen, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";

const heroImage =
  "https://images.pexels.com/photos/7682342/pexels-photo-7682342.jpeg?auto=compress&cs=tinysrgb&w=1800";
const heroVideo =
  "https://www.pexels.com/download/video/35402288/";

const Index = () => {
  return (
    <div className="space-y-12">
      <section className="relative min-h-[520px] overflow-hidden rounded-3xl shadow-pop animate-scale-in">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={heroImage}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/92 via-sky/78 to-bubblegum/82 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/72 via-foreground/38 to-transparent" />

        <div className="relative flex min-h-[520px] max-w-4xl flex-col justify-end px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-primary-foreground/80 animate-fade-in-down">
            4AM Media Social Media Team
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.04] text-primary-foreground sm:text-6xl animate-fade-in stagger-1">
            The CSR desk for smoother shifts, faster answers, and better handoffs.
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-primary-foreground/90 sm:text-lg animate-fade-in stagger-2">
            Open announcements, scorecards, support macros, team resources, and
            handbook guidance from one polished workspace built for the 4AM flow.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 animate-fade-in stagger-3">
            <Link
              to="/macros"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-foreground px-5 py-3 text-sm font-extrabold text-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Start with macros
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 bg-white/15 px-5 py-3 text-sm font-extrabold text-primary-foreground backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white/25"
            >
              Browse resources
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 animate-fade-in stagger-4">
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

      <div className="animate-fade-in stagger-5">
        <TopPerformerBanner />
      </div>
      <div className="animate-fade-in stagger-6">
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
