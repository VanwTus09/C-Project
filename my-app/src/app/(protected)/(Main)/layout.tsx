const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <main className="h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
