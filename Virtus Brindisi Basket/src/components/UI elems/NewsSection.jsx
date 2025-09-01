import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfoCard from "./InfoCard"
import MainButton from "./MainButton"
import { motion, useAnimation } from "motion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { getLatestNews } from "../../api/news";
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function NewsSection() {
  const controls = useAnimation();
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const data = await getLatestNews(2) // Prendiamo le ultime 2 news
        setNews(data)
      } catch (err) {
        setError('Errore nel caricamento delle news')
        console.error('Error fetching news:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    const startAnimations = async () => {
      await controls.start({ opacity: 1, x: 0 });
    }

    startAnimations()
  }, [controls]);

  if (loading) {
    return (
      <div className="w-full bg-black py-8 px-4 md:px-8 overflow-hidden">
        <motion.h2 
        className="text-5xl md:text-7xl font-bold uppercase text-white mb-6"
        initial={{ opacity: 0, x: 100}}
        whileInView={{ opacity: 1, x: 0}}
        transition={{duration: 1}}
        viewport={{ once: true }}>
          Ultime <span className="text-yellow-400">News</span>
        </motion.h2>
        <div className="text-white text-center py-8">Caricamento news...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-black py-8 px-4 md:px-8 md:min-h-screen overflow-hidden">
        <motion.h2 
        className="text-5xl md:text-7xl font-bold uppercase text-white mb-6"
        initial={{ opacity: 0, x: 100}}
        whileInView={{ opacity: 1, x: 0}}
        transition={{duration: 1}}
        viewport={{ once: true }}>
          Ultime <span className="text-yellow-400">News</span>
        </motion.h2>
        <div className="text-red-400 text-center py-8">{error}</div>
      </div>
    )
  }

  return (
    <div className="w-full bg-black py-8 px-4 md:px-8 md:min-h-screen overflow-hidden">
      <motion.h2 
      className="text-5xl md:text-7xl font-bold uppercase text-white mb-6"
      initial={{ opacity: 0, x: 100}}
      whileInView={{ opacity: 1, x: 0}}
      transition={{duration: 1}}
      viewport={{ once: true }}>
        Ultime <span className="text-yellow-400">News</span>
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-center gap-6  md:min-h-[96]">
          {news.length > 0 ? (
            news.map((article, index) => (
              <motion.div
                className="mt-10"
                key={article.id}
                initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}>
                <InfoCard className="p-6 flex-col justify-start h-[500px] max-w-lg">
                  {article.image_url && (
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                    {article.excerpt || article.content?.substring(0, 150) + '...'}
                  </p>
                  <div className="flex flex-grow w-full text-left">
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(article.created_at).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  {article.category && (
                    <span className="inline-block bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  )}
                  <div>
                    <MainButton>
                      Leggi di più
                      <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
                    </MainButton>
                  </div>
                </InfoCard>
              </motion.div>
            ))
          ) : (
            // Placeholder se non ci sono news
            <>
              <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}>
                <InfoCard className="p-6 flex-col min-h-[400px] justify-center">
                  <div className="text-gray-500 text-center">
                    <h3 className="text-xl font-bold mb-3">Nessuna news disponibile</h3>
                    <p>Le ultime notizie verranno mostrate qui appena disponibili.</p>
                  </div>
                </InfoCard>
              </motion.div>
              <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}>
                <InfoCard className="p-6 flex-col min-h-[400px] justify-center">
                  <div className="text-gray-500 text-center">
                    <h3 className="text-xl font-bold mb-3">Aggiungi contenuti</h3>
                    <p>Utilizza la dashboard amministratore per aggiungere news e aggiornamenti.</p>
                  </div>
                </InfoCard>
              </motion.div>
            </>
          )}
      </div>

      <motion.div 
      className="flex justify-center mt-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}>
        <Link to="/news">
          <MainButton>
            Vai alle notizie
            <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
          </MainButton>
        </Link>
      </motion.div>
    </div>
  )
}
