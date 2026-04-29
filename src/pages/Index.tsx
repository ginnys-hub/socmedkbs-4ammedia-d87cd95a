import AnnouncementsBoard from "@/components/AnnouncementsBoard";
import TopPerformerBanner from "@/components/TopPerformerBanner";

const Index = () => {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-hero p-8 sm:p-12 shadow-pop animate-scale-in">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80 animate-fade-in-down">
          4AM Media · Social Media Team
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-primary-foreground animate-fade-in stagger-1">
          Welcome to the team KBS ✨
        </h1>
        <p className="mt-3 max-w-2xl text-primary-foreground/90 animate-fade-in stagger-2">
          Everything our social media team needs in one place — announcements,
          scorecards, and macros. Stay sharp, stay synced, stay caffeinated.
        </p>
      </section>

      <div className="animate-fade-in stagger-3">
        <TopPerformerBanner />
      </div>
      <div className="animate-fade-in stagger-4">
        <AnnouncementsBoard />
      </div>
    </div>
  );
};

export default Index;
