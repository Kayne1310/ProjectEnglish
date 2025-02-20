import { Link } from "react-router-dom";
import styles from "./FAQ.module.css"; // Import CSS module

const FAQ = () => {
    return (
        <main id="main" className={styles.main}>
            <div className={styles.pagetitle}>
                <h1>Frequently Asked Questions</h1>
                <nav>
                    <ol className={styles.breadcrumb}>
                        <li className={styles.breadcrumbItem}><Link to="/">Home</Link></li>
                        <li className={styles.breadcrumbItem}>Pages</li>
                        <li className={`${styles.breadcrumbItem} ${styles.active}`}>Frequently Asked Questions</li>
                    </ol>
                </nav>
            </div>

            <section className={styles.sectionFaq}>
                <div className={styles.row}>
                    <div className={styles.colLg12}>
                        <div className={`${styles.card} ${styles.basic}`}>
                            <div className={styles.cardBody}>
                                <h5 className={styles.cardTitle}>Basic Questions</h5>

                                <div className={styles.faqItem}>
                                    <h6>1. How do I create a new flashcard set?</h6>
                                    <p>You can easily create a new flashcard set by clicking on the &quot;Create&quot; button on your dashboard. Afterward, you can add terms, definitions, and customize your set by selecting themes or adding images.</p>
                                </div>

                                <div className={`${styles.faqItem} ${styles.pt3}`}>
                                    <h6>2. Can I study offline using Quizlet?</h6>
                                    <p>Yes, Quizlet allows you to study offline through its mobile app. Make sure to download your flashcards in advance to access them without the internet.</p>
                                </div>

                                <div className={`${styles.faqItem} ${styles.pt3}`}>
                                    <h6>3. How can I share my flashcards with others?</h6>
                                    <p>Once you create a flashcard set, click on the &quot;Share&quot; option. You can then copy the link or share it directly via email or social media. You can also make your set public so others can search and use it.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default FAQ;
