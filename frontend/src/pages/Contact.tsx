import { Container } from '../components/ui/Container';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <Container className="py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-primary mb-6 text-center">Contact Us</h1>
      <p className="text-text-muted text-center mb-16 text-lg max-w-2xl mx-auto">
        Have questions about Sweet Monk? We'd love to hear from you. Fill out the form below or reach out to us directly.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-text-main mb-1">Email</h3>
                <a href="mailto:hello@thesweetchange.com" className="text-text-muted hover:text-primary transition-colors">hello@thesweetchange.com</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-text-main mb-1">Phone</h3>
                <a href="tel:+18001234567" className="text-text-muted hover:text-primary transition-colors">1-800-123-4567</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-text-main mb-1">Office</h3>
                <p className="text-text-muted">123 Sweet Street<br />San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
        </div>

        <form className="bg-surface p-8 rounded-xl border border-border" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-main mb-1">Name</label>
              <input type="text" id="name" required className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1">Email</label>
              <input type="email" id="email" required className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-main mb-1">Message</label>
              <textarea id="message" required rows={5} className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
