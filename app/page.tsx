import CoffeeScroll from "@/components/CoffeeScroll";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#00735C]">
            <CoffeeScroll />

            {/* Additional Content could go here */}
            <footer className="py-10 text-center text-white/50 font-sans text-sm">
                &copy; {new Date().getFullYear()} HOMIE Coffee. Bảo lưu mọi quyền.
            </footer>
        </main>
    );
}
