import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-wine text-center mb-4">How It Works</h1>
        <p className="text-xl text-center text-gray-600 mb-16">
          Our simple process makes custom product creation easy
        </p>

        {/** Step 1 */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <div className="rounded-full bg-brand-light w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-brand-indigo font-bold text-xl">1</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Choose Your Product</h2>
            <p className="text-gray-600 mb-4">
              Browse through our wide variety of customizable products. From t-shirts and bags to awards and banners, we offer extensive options to suit your needs.
            </p>
            <p className="text-gray-600">
              Each product displays detailed specifications and customization options available.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=500"
              alt="Choose product"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/** Step 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-16">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
            <div className="rounded-full bg-brand-light w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-brand-indigo font-bold text-xl">2</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Upload Your Design</h2>
            <p className="text-gray-600 mb-4">
              Upload your custom artwork, logo, or design directly to our platform. Our system accepts most common file formats including PNG, JPG, PDF, and AI files.
            </p>
            <p className="text-gray-600">
              Don't have a design ready? We can help! Contact our design team for assistance.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=500"
              alt="Upload design"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/** Step 3 */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <div className="rounded-full bg-brand-light w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-brand-indigo font-bold text-xl">3</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Review & Approve</h2>
            <p className="text-gray-600 mb-4">
              Once you've chosen your product and uploaded your design, you'll have the opportunity to review your order. Double-check all customization options, including colors, sizes, and quantities.
            </p>
            <p className="text-gray-600">
              For larger orders, our team will send you a digital proof for final approval before production.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500"
              alt="Review order"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/** Step 4 */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-16">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
            <div className="rounded-full bg-brand-light w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-brand-indigo font-bold text-xl">4</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Production & Delivery</h2>
            <p className="text-gray-600 mb-4">
              After approval, we'll begin producing your custom items. Our production typically takes 2-3 business days for standard orders, with express options available.
            </p>
            <p className="text-gray-600">
              Once completed, your order will be carefully packaged and shipped to your specified address. You'll receive tracking information via email.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=500"
              alt="Production and delivery"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/** FAQ Section */}
        <div className="bg-gray-50 p-8 rounded-lg mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">What file formats do you accept for designs?</h3>
              <p className="text-gray-600">
                We accept PNG, JPG, PDF, AI, PSD, and SVG file formats. For best results, vector formats (AI, SVG) are recommended for logos and graphics.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">How long does production take?</h3>
              <p className="text-gray-600">
                Standard production time is 2-3 business days plus shipping time. Rush orders may be available for an additional fee.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Is there a minimum order quantity?</h3>
              <p className="text-gray-600">
                Some products have minimum order quantities, which will be clearly indicated on the product page. Many items can be ordered in single quantities.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Can I track my order?</h3>
              <p className="text-gray-600">
                Yes! Once your order ships, you'll receive an email with tracking information. You can also view tracking details in your account under "My Orders".
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">What if I'm not satisfied with my order?</h3>
              <p className="text-gray-600">
                We stand behind our quality and want you to be completely satisfied. If there's an issue with your order, please contact us within 7 days of receipt.
              </p>
            </div>
          </div>
        </div>

        {/** CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Custom Products?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start designing today and bring your ideas to life with our easy-to-use platform and high-quality products.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link to="/register">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;