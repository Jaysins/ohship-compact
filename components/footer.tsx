export default function Footer() {
  return (
    <footer className="bg-background-secondary-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-primary text-3xl">🚚</span>
              <h2 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold">ShipLogic</h2>
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              The modern platform for efficient, reliable, and intelligent logistics.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 lg:col-span-3 gap-8">
            <div>
              <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                    href="#"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                    href="#"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                    href="#"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                    href="#"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                    href="#"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                    href="#"
                  >
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                    href="#"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
            © 2025 ShipLogic, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
              href="#"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
              href="#"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
