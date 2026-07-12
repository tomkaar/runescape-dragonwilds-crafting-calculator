import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-background rounded-lg border p-6 shadow-lg flex items-center justify-center size-16">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		</div>
	);
}
