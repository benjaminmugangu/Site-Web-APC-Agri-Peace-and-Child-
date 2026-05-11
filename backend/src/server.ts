import app from './app';
import { AppDataSource } from './config/database.config';
import { logger } from './config/logger.config';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Initialisation de la Base de Données
    await AppDataSource.initialize();
    logger.info('📦 Base de données PostgreSQL connectée avec succès');

    // 2. Démarrage du serveur HTTP
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      logger.info(`🌍 Environnement : ${process.env.NODE_ENV}`);
    });

    // 3. Graceful Shutdown (Arrêt propre)
    const gracefulShutdown = () => {
      logger.info('Arrêt du serveur en cours...');
      server.close(async () => {
        logger.info('Serveur HTTP arrêté.');
        await AppDataSource.destroy();
        logger.info('Connexion DB fermée.');
        process.exit(0);
      });

      // Force l'arrêt après 10s
      setTimeout(() => {
        logger.error('Arrêt forcé après timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('❌ Erreur lors du démarrage du serveur :', error);
    process.exit(1);
  }
};

startServer();
