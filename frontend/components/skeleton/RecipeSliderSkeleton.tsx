export const RecipeSliderSkeleton = () => {
    return (
      <section className="relative mt-10 animate-pulse max-w-6xl mx-auto px-4">
        {/* Título */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-48 bg-gray-300 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
  
        {/* Carrusel horizontal */}
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded shadow p-4 flex-shrink-0"
              style={{
                width: '100%',              
                maxWidth: '100%',           
              }}
            >
              <div className="w-full h-40 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="flex justify-between items-center">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-12 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };
  