import AnnouncementsBoard from "@/components/AnnouncementsBoard";
import TopPerformerBanner from "@/components/TopPerformerBanner";

const Index = () => {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-hero p-8 sm:p-12 shadow-pop">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">
          4AM Media · Social Media Team
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-primary-foreground">
          Welcome to the team KBS ✨
        </h1>
        <p className="mt-3 max-w-2xl text-primary-foreground/90">
          Everything our social media team needs in one place — announcements,
          scorecards, and macros. Stay sharp, stay synced, stay caffeinated.
        </p>
      </section>

      <TopPerformerBanner />
      <AnnouncementsBoard />
    </div>
  );
};

export default Index;
