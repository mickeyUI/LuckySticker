"use client";

import { useState } from "react";
import { ShoppingBag, MailIcon, PhoneCallIcon } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTelegramPlane,
  FaPhone,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiChevronDown } from "react-icons/fi";
import PopCategoriesCard from "../components/PopCategoriesCard";

export default function Home() {
  const faqs = [
    {
      question: "Do you offer delivery to BoleBulbula?",
      answer:
        "Yes. We offer local delivery to BoleBulbula, and other selected areas. Delivery availability and fees may vary depending on your location.",
    },
    {
      question: "Do you make custom poster prints?",
      answer:
        "Currently, we focus on our collection of pre-made posters. Custom printing is not available at the moment.",
    },
    {
      question: "How can I order a poster?",
      answer:
        "Browse our collection, choose the posters you like, add them to your order, and provide your delivery details at checkout. We’ll take care of the rest.",
    },
    {
      question: "What sizes are your posters available in?",
      answer:
        "Our posters are available in different sizes to suit different spaces. You can check the available sizes on each poster's product page.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept convenient local payment methods, including Telebirr and CBE. Payment options are shown when you place your order.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery time depends on your location and order details. We’ll provide the expected delivery time when your order is confirmed.",
    },
  ];

  const [openFaq, setOpenFaq] = useState(0);
  return (
    <main>
      <section className="herosection h-[100vh] bg- w-full  bg-[url('../public/background.png')] bg-cover bg-center bg-no-repeat">
        <div className="h-[100vh] leniear-gradiant-effect absolute inset-0 bg-gradient-to-t from-backgroundd/100 via-backgroundd/60 to-transparent"></div>

        {/* navigation */}
        <nav className="fixed left-1/2 top-4 z-50 w-[min(1120px,calc(100%-24px))] -translate-x-1/2 rounded-full card-style px-5 py-4 shadow-glass backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <a
              href="#top"
              className="text-heighlight font-display text-2xl font-bold tracking-wide"
            >
              Lucky Sticker
            </a>
            <div className="hidden items-center gap-7 text-[17px] text-crema/75 md:flex">
              <a
                href={`#`}
                className="transition hover:text-saffron hover:text-heighlight"
              >
                Location
              </a>
              <a
                href={`#`}
                className="transition hover:text-saffron hover:text-heighlight"
              >
                FAQ
              </a>
              <a
                href={`#`}
                className="transition hover:text-saffron hover:text-heighlight"
              >
                Category
              </a>

              <button className="cart-box relative">
                <div className="badge text-sm  rounded-2xl bg-red-600 absolute left-4 -top-2 w-5 h-5 flex items-center justify-center ">
                  <h1>3</h1>
                </div>
                <ShoppingBag className="transition text-heighlight hover:text-yellow-700" />
              </button>

              <a
                href={`#`}
                className="transition flex items-center justify-center text-sm hover:text-saffron border rounded-2xl pt-[5px] pb-1.5 px-3 text-heighlight bg-black hover:text-black hover:bg-heighlight"
              >
                Login
              </a>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col gap-4 h-full justify-center px-5 pt-54 sm:px-8 lg:px-14">
          <h1 className="text-[75px] font-semibold font-sans  ">
            Express Yourself, Get <br />
            <em>Inspired</em>
          </h1>
          <p className="text-heighlight text-2xl">
            Explore our collection of ready-to-print posters, from art and
            photography
            <br /> to quotes, designs, and more
          </p>
          <div className="flex w-fit ml-2 mt-5 gap-5">
            <button className="bg-heighlight text-black text-[20px] flex items-center gap-1 rounded-4xl  py-2.5 px-4.5">
              Explore Posters <FiArrowUpRight />
            </button>
            <button className="bg-white/20 border border-white/40 text-black text-[20px] flex items-center gap-1 rounded-4xl  py-2.5 px-4.5">
              SignUp
            </button>
          </div>
        </div>
      </section>

      <section className="popularcategores p-15">
        <div className="mb-20 flex justify-center">
          <h1 className=" text-8xl font-bold">Popular Categories</h1>
        </div>
        <div className="flex justify-center items-center w-full ">
          <div className="grid lg:grid-cols-2 w-auto gap-15 gap-x-50">
            {[
              {
                name: "Anime Collection",
                img: "/Naruto.jpg",
                bgColor: "from-black/100 to-transparent",
              },
              {
                name: "Art Collection",
                img: "/art.jpg",
                bgColor: "from-[#081010]/100 via-[#081014] to-[#081010]/40",
              },
              {
                name: "Music Collection",
                img: "/teddy.jpg",
                bgColor: "from-[#B2352F]/100 via-[#B2352F] to-[#B2352F]/40",
              },
              {
                name: "Car Collection",
                img: "/car.jpg",
                bgColor: "from-[#141414]/100 via-[#141414] to-[#141414]/40",
              },
            ].map((collection) => (
              <PopCategoriesCard
                key={collection.name}
                title={collection.name}
                imageUrl={collection.img}
                link="#"
                bgColor={collection.bgColor}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="location p-25">
        {/* <div className="mb-10">
          <h1 className=" text-6xl">Fast Deliver Locations</h1>
        </div> */}

        <div className="grid lg:grid-cols-[3fr_2fr] gap-15">
          <div className="image border-2 border-amber-500/20 rounded-[20px] shadow-amber-500/20 shadow-2xl h-[60vh] w-full bg-[url('../public/map.png')] bg-cover bg-center bg-no-repeat"></div>

          <div className="location-card flex flex-col justify-around p-7 md:p-10 h-[60vh]">
            <h2 className="font-display text-5xl font-bold">
              Fast Delivery Locations
            </h2>
            <div className="mt-8 space-y-5 text-crema/72 text-[17px]">
              <p>Bole, next to the airport between 7:00 AM-8:00 AM</p>
              <p>4 Kilo, near AAU campus between 12:00 PM-2:00 PM</p>
              <p>Summit, near Safari mall between 9:00 PM-4:00 PM</p>
              <p className="text-[15px]">
                Our main shop is at Ayertena if you want to make a request or
                shop
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 flex-col">
              <a
                className="contact-chip bg-green-500/50"
                href="tel:+251911117746"
              >
                <FaPhone /> +251 91 111 7746
              </a>
              <a
                className="contact-chip bg-telegram-blue/60"
                href="mailto:SuperJuice@gmail.com"
              >
                <FaTelegramPlane /> @Lucky_Stickerr
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">Social Ritual</p>
          <h2 className="section-title text-8xl font-bold">
            Follow the journey
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: FaInstagram,
              label: "Instagram",
              value: "@Lucky_Stickerr",
              color: "instagram-style",
            },
            {
              icon: FaTiktok,
              label: "TikTok",
              value: "@Lucky_Stickerr",
              color: " tiktok-style",
            },
            {
              icon: FaFacebookF,
              label: "Facebook",
              value: "@Lucky_Stickerr",
              color: "facebook-style",
            },
          ].map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href="#top"
                whileHover={{ y: -8, scale: 1.02 }}
                className={` ${social.color}`}
              >
                <Icon className="text-3xl text-saffron" />
                <span className="mt-8 text-sm uppercase tracking-[0.24em] text-crema/45">
                  {social.label}
                </span>
                <strong className="mt-2 text-xl">{social.value}</strong>
              </motion.a>
            );
          })}
        </div>
      </section>

      <section id="faq" className="section-shell max-w-5xl">
        <div className="text-center">
          <p className="eyebrow justify-center">FAQ</p>
          <h2 className="section-title text-8xl font-bold">
            Most Asked Questions
          </h2>
        </div>

        <div className="mt-12 space-y-4 font-light">
          {faqs.map((faq, index) => (
            <div key={faq.question}>
              <button
                className="faq-item"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                aria-expanded={openFaq === index}
              >
                <span className="flex items-center justify-between gap-4 text-left">
                  <span className="font-display text-2xl font-bold">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                  >
                    <FiChevronDown />
                  </motion.span>
                </span>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.span
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="block overflow-hidden"
                    >
                      <span className="block pt-4 text-left text-crema/68">
                        {faq.answer}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 pb-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 pt-8 text-sm text-crema/55 md:flex-row md:items-center md:justify-between">
          <p>Lucky Stickers </p>
          <p>Owner - Henna Welse</p>
        </div>
      </footer>
    </main>
  );
}
