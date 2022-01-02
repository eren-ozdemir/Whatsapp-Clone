import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FilePreview = ({ preview }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="file-preview-container"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
      >
        <img src={preview} />
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreview;
