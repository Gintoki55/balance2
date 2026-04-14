

const [isMaintenance, setIsMaintenance] = useState(true);

{isMaintenance && (
    <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold py-2 rounded-lg">
        
        {/* Spinner */}
        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>

        <span>Under Maintenance...</span>
    </div>
    )}
