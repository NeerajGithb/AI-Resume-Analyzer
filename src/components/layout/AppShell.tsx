interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    return (
        <div className=" min-h-screen  bg-[var(--bg)] text-[var(--text-primary)]">
            <main className="">{children}</main>
        </div>
    );
}