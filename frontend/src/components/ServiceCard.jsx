import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Star, 
  Tag, 
  ArrowRight, 
  Printer, 
  CheckCircle, 
  Sparkles,
  Zap,
  Award,
  Eye
} from "lucide-react";

export default function ServiceCard({ item, index, className, style }) {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (category) => {
    const icons = {
      Business: <Printer className="w-4 h-4" />,
      Marketing: <Eye className="w-4 h-4" />,
      Events: <Sparkles className="w-4 h-4" />,
      Custom: <Award className="w-4 h-4" />,
      'Large Format': <Zap className="w-4 h-4" />,
      'Photo Printing': <Sparkles className="w-4 h-4" />,
    };
    return icons[category] || <Printer className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Business: 'bg-blue-100 text-blue-700',
      Marketing: 'bg-green-100 text-green-700',
      Events: 'bg-purple-100 text-purple-700',
      Custom: 'bg-amber-100 text-amber-700',
      'Large Format': 'bg-red-100 text-red-700',
      'Photo Printing': 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  // Generate features from description (simple approach)
  const extractFeatures = (description) => {
    if (!description) return [];
    
    // Simple feature extraction - in real app, you might want to store features separately
    const commonFeatures = [
      "Matte/Gloss finish",
      "Lamination available",
      "Same day service",
      "Bulk discounts",
      "Custom sizes",
      "Free design help",
      "Delivery available"
    ];
    
    // Return 2-3 random features for demo
    // In production, you'd want to store features in your database
    return commonFeatures.slice(0, 2 + Math.floor(Math.random() * 2));
  };

  const features = extractFeatures(item.description);

  return (
    <div 
      className={`group relative border border-slate-200 rounded-2xl bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {item.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-md">
            <Star className="w-3 h-3 fill-white" />
            Popular
          </span>
        </div>
      )}

      {/* Card Header with Gradient */}
      <div className="relative bg-gradient-to-br from-slate-50 to-white p-6 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category || 'General')}`}>
                {getCategoryIcon(item.category || 'General')}
                {item.category || "General"}
              </span>
              
              {!item.active && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                  Coming Soon
                </span>
              )}
            </div>

            {/* Service Title */}
            <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
              {item.name}
            </h3>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Fast Turnaround</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Quality Guarantee</span>
              </div>
            </div>
          </div>

          {/* Interactive Indicator */}
          <div className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Description */}
        {item.description && (
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {item.description}
          </p>
        )}

        {/* Features List */}
        {features.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Key Features
            </div>
            <div className="space-y-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['Premium Finish', 'Fast Delivery', 'Customizable'].map((tag, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to="/quote"
          className="group/btn w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-300"
        >
          <span>Get Quote</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-200 transition-colors duration-300 pointer-events-none" />
      
      {/* Shine Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-700 pointer-events-none" 
           style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)' }} />
    </div>
  );
}

// Optional: Add this to your global CSS for shine effect optimization
const styles = `
.service-card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: transform 0.7s;
}

.group:hover .service-card-shine {
  transform: translateX(200%);
}
`;