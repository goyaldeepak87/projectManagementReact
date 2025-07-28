// import { ExternalLink, Share2, Zap } from 'lucide-react';

import { useParams } from "next/navigation";
import { ExternalLink, Share2, Zap } from "react-feather";

const ProjectItemHeader = ({ project }) => {

    const router = useParams()

  const [name, projectName = "Project Name"] = router?.id?.split('-') || [];
  return (
    <div className="flex items-center justify-between border-b border-gray-300 mb-[43px] pt-[15px] pb-[22px] p-0 border-b border-gray-300 ">
      {/* Left side: Icon + Name */}
      <div>
        <div className="mb-3 text-[#616161]">Projects</div>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8  rounded-md bg-purple-400 flex items-center justify-center text-white font-bold uppercase">
          {name?.charAt(0)}
        </div>
        <span className="text-gray-800 text-[30px] font-bold truncate max-w-[200px]">{name} {projectName}</span>
      </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-md" title="Open">
          <ExternalLink size={16} className="text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md" title="Share">
          <Share2 size={16} className="text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md" title="Action">
          <Zap size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default ProjectItemHeader;
