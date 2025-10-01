
const Navbar1: React.FC = () => {
  return (
    <div className="w-full bg-black text-white text-gray-800 text-sm py-2 border-b border-gray-200 flex justify-center items-center">
      <span className="mr-6 flex items-center">
        <span className="mr-1">📞</span>
        <a href="tel:+1234567890" className="hover:text-blue-600 transition-colors">+1 234 567 890</a>
      </span>
      <span className="flex items-center">
        <span className="mr-1">✉️</span>
        <a href="mailto:info@example.com" className="hover:text-blue-600 transition-colors">info@example.com</a>
      </span>
    </div>
  );
};

export default Navbar1;