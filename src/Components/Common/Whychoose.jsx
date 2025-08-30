import { Download, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Download className="text-blue-500 w-10 h-10" />,
    title: 'Easy Resume Access',
    description: 'Download and manage resumes with just a few clicks.',
  },
  {
    icon: <ShieldCheck className="text-emerald-500 w-10 h-10" />,
    title: 'Secure Platform',
    description: 'Your data is protected with enterprise-grade security.',
    highlight: true,
  },
  {
    icon: <Users className="text-yellow-500 w-10 h-10" />,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with your recruitment team.',
  },
];

export default function Whychoose() {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-24 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-12"
      >
        Why Choose{' '}
        <span className="text-transparent bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-clip-text">
          Profile View
        </span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className={`rounded-xl shadow-md p-8 transition-all duration-300 ${
              feature.highlight
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
