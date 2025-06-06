"use client";
import React, { useState } from 'react';
import styles from './CVOptimizer.module.css';

const CVUploadForm = () => {
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cvFile || !jobDescription) {
      setError('Harap unggah CV dan masukkan deskripsi pekerjaan!');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('cvFile', cvFile);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/analyzeCV', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan pada server');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setActiveTab('overview');
    } catch (err) {
      console.error("Terjadi error:", err);
      setError(err.message || 'Terjadi kesalahan dalam mengirim data. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = (score) => {
    let color;
    if (score >= 80) color = '#4CAF50';
    else if (score >= 60) color = '#FFC107';
    else color = '#F44336';
    
    return (
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar}
          style={{ width: `${score}%`, backgroundColor: color }}
        ></div>
        <span className={styles.progressText}>{score}%</span>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroHeader}>
        <h2 className={styles.title}>
          <i className={`${styles.titleIcon} fas fa-magic`}></i> Optimasi CV untuk Pekerjaan Impian Anda
        </h2>
        <p className={styles.subtitle}>
          <i className={`${styles.subtitleIcon} fas fa-bullseye`}></i> Unggah CV dan deskripsi pekerjaan untuk mendapatkan analisis mendalam
        </p>
        <div className={styles.decorativeLine}></div>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        <div className={styles.formGroup}>
          <label htmlFor="cvFile" className={styles.formLabel}>
            <i className={`${styles.labelIcon} fas fa-file-alt`}></i> Unggah CV (PDF/DOCX):
          </label>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              id="cvFile"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className={styles.formInput}
              required
              style={{ display: 'none' }}
            />
            <label htmlFor="cvFile" className={styles.fileInputButton}>
              <i className={`${styles.icon} fas fa-cloud-upload-alt`}></i>
              {cvFile ? (
                <>
                  <span className={styles.fileName}>{cvFile.name}</span>
                  <i 
                    className={`${styles.fileClearIcon} fas fa-times`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCvFile(null);
                    }}
                  ></i>
                </>
              ) : (
                'Pilih File'
              )}
            </label>
          </div>
          <p className={styles.fileHint}>
            <i className={`${styles.hintIcon} fas fa-info-circle`}></i> Format PDF/DOCX, maksimal 5MB
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobDescription" className={styles.formLabel}>
            <i className={`${styles.labelIcon} fas fa-clipboard-list`}></i> Deskripsi Pekerjaan:
          </label>
          <div className={styles.textareaWrapper}>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={handleDescriptionChange}
              placeholder="Tempelkan deskripsi pekerjaan yang ingin Anda lamar..."
              rows="5"
              className={styles.formTextarea}
              required
            />
            <i className={`${styles.textareaIcon} fas fa-paste`}></i>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? (
            <>
              <i className={`${styles.spinner} fas fa-spinner`}></i> Memproses...
            </>
          ) : (
            <>
              <i className={`${styles.buttonIcon} fas fa-search-plus`}></i> Analisis CV
            </>
          )}
        </button>
      </form>

      {error && (
        <div className={styles.errorContainer} role="alert">
          <i className={`${styles.errorIcon} fas fa-exclamation-triangle`}></i>
          <div>
            <h4 className={styles.errorTitle}>Perhatian</h4>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        </div>
      )}
      
      {analysisResult && (
        <div className={styles.resultContainer}>
          <div className={styles.resultHeader}>
            <div>
              <h3 className={styles.resultTitle}>
                <i className={`${styles.resultTitleIcon} fas fa-chart-pie`}></i> Hasil Analisis CV
              </h3>
              <p className={styles.resultSubtitle}>
                <i className={`${styles.subtitleIcon} fas fa-user-tie`}></i> Berdasarkan deskripsi pekerjaan Anda
              </p>
            </div>
            <div className={styles.overallScore}>
              <div 
                className={styles.scoreCircle} 
                style={{ '--score-percent': `${analysisResult.overallScore}%` }}
              >
                {analysisResult.overallScore >= 80 ? (
                  <i className={`${styles.scoreEmoji} fas fa-trophy`}></i>
                ) : analysisResult.overallScore >= 60 ? (
                  <i className={`${styles.scoreEmoji} fas fa-thumbs-up`}></i>
                ) : (
                  <i className={`${styles.scoreEmoji} fas fa-lightbulb`}></i>
                )}
                <span className={styles.scoreValue}>{analysisResult.overallScore}</span>
                <span className={styles.scoreLabel}>Skor</span>
              </div>
              <p className={styles.scoreDescription}>
                <i className={`${styles.descriptionIcon} fas ${
                  analysisResult.overallScore >= 80 ? "fa-smile" : 
                  analysisResult.overallScore >= 60 ? "fa-meh" : "fa-frown"
                }`}></i>
                {analysisResult.overallScore >= 80 ? "Sangat Baik! CV Anda sudah cukup kuat." : 
                 analysisResult.overallScore >= 60 ? "Cukup Baik, tetapi masih bisa ditingkatkan." : 
                 "Perlu banyak perbaikan untuk bersaing."}
              </p>
            </div>
          </div>

          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className={`${styles.tabIcon} fas fa-binoculars`}></i> Ringkasan
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'categories' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <i className={`${styles.tabIcon} fas fa-layer-group`}></i> Kategori
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'keywords' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('keywords')}
            >
              <i className={`${styles.tabIcon} fas fa-keyboard`}></i> Kata Kunci
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'actions' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              <i className={`${styles.tabIcon} fas fa-tasks`}></i> Tindakan
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overviewContent}>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <i className={`${styles.sectionIcon} fas fa-award`}></i> Kekuatan Utama
                  </h4>
                  <ul className={styles.strengthsList}>
                    {analysisResult.categories.filter(c => c.score >= 80).length > 0 ? (
                      analysisResult.categories.filter(c => c.score >= 80).map((cat, index) => (
                        <li key={index} className={styles.strengthItem}>
                          <i className={`${styles.listIcon} fas fa-check-circle`}></i>
                          <div>
                            <strong>{cat.name}</strong>
                            <p>{cat.description}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className={styles.noItems}>
                        <i className={`${styles.listIcon} fas fa-info-circle`}></i>
                        Tidak ada kategori dengan skor tinggi
                      </li>
                    )}
                  </ul>
                </section>

                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <i className={`${styles.sectionIcon} fas fa-tools`}></i> Area Perbaikan
                  </h4>
                  <ul className={styles.improvementList}>
                    {analysisResult.categories.filter(c => c.score < 70).length > 0 ? (
                      analysisResult.categories.filter(c => c.score < 70).map((cat, index) => (
                        <li key={index} className={styles.improvementItem}>
                          <i className={`${styles.listIcon} fas fa-arrow-up`}></i>
                          <div>
                            <strong>{cat.name} ({cat.score}%)</strong>
                            <p>{cat.description}</p>
                            {cat.suggestions.length > 0 && (
                              <div className={styles.quickTips}>
                                <i className={`${styles.tipIcon} fas fa-lightbulb`}></i>
                                {cat.suggestions[0]}
                              </div>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className={styles.noItems}>
                        <i className={`${styles.listIcon} fas fa-check-circle`}></i>
                        Semua kategori sudah cukup baik!
                      </li>
                    )}
                  </ul>
                </section>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className={styles.categoriesContent}>
                {analysisResult.categories.map((category, index) => (
                  <article key={index} className={styles.categoryCard}>
                    <div className={styles.categoryHeader}>
                      <div>
                        <h5 className={styles.categoryName}>
                          <i className={`${styles.categoryIcon} fas fa-${category.icon || 'chart-bar'}`}></i>
                          {category.name}
                        </h5>
                        <p className={styles.categoryScore}>Skor: {category.score}/100</p>
                      </div>
                      {renderProgressBar(category.score)}
                    </div>
                    <p className={styles.categoryDescription}>{category.description}</p>
                    
                    {category.suggestions.length > 0 && (
                      <div className={styles.suggestions}>
                        <h6 className={styles.suggestionsTitle}>
                          <i className={`${styles.suggestionTitleIcon} fas fa-lightbulb`}></i> Rekomendasi Perbaikan:
                        </h6>
                        <ul className={styles.suggestionsList}>
                          {category.suggestions.map((suggestion, i) => (
                            <li key={i} className={styles.suggestionItem}>
                              <i className={`${styles.suggestionIcon} fas fa-chevron-circle-right`}></i>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {activeTab === 'keywords' && (
              <div className={styles.keywordsContent}>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <i className={`${styles.sectionIcon} fas fa-search`}></i> Kata Kunci yang Hilang
                  </h4>
                  <p className={styles.sectionDescription}>
                    Kata kunci berikut muncul dalam deskripsi pekerjaan tetapi tidak ditemukan di CV Anda:
                  </p>
                  
                  <div className={styles.keywordsGrid}>
                    {analysisResult.missingKeywords.length > 0 ? (
                      analysisResult.missingKeywords.map((keyword, index) => (
                        <div key={index} className={styles.keywordPill}>
                          <i className={`${styles.keywordIcon} fas fa-hashtag`}></i>
                          {keyword}
                        </div>
                      ))
                    ) : (
                      <div className={styles.noKeywords}>
                        <i className={`${styles.keywordIcon} fas fa-check-circle`}></i>
                        CV Anda sudah mencakup semua kata kunci penting!
                      </div>
                    )}
                  </div>
                </section>

                {analysisResult.recommendedKeywords && analysisResult.recommendedKeywords.length > 0 && (
                  <section className={styles.section}>
                    <h4 className={styles.sectionTitle}>
                      <i className={`${styles.sectionIcon} fas fa-bullseye`}></i> Kata Kunci yang Direkomendasikan
                    </h4>
                    <p className={styles.sectionDescription}>
                      Kata kunci berikut dapat meningkatkan relevansi CV Anda untuk posisi ini:
                    </p>
                    
                    <div className={styles.keywordsGrid}>
                      {analysisResult.recommendedKeywords.map((keyword, index) => (
                        <div key={index} className={styles.keywordPill}>
                          <i className={`${styles.keywordIcon} fas fa-star`}></i>
                          {keyword}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className={styles.tipBox}>
                  <i className={`${styles.tipBoxIcon} fas fa-info-circle`}></i>
                  <div>
                    <strong>Tip Profesional:</strong> Menambahkan kata kunci yang relevan dapat meningkatkan peluang CV Anda terdeteksi oleh sistem ATS sebesar 40-60%.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className={styles.actionsContent}>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <i className={`${styles.sectionIcon} fas fa-rocket`}></i> Langkah-Langkah Optimasi
                  </h4>
                  <p className={styles.sectionDescription}>
                    Berikut adalah tindakan spesifik yang dapat Anda lakukan untuk meningkatkan CV Anda:
                  </p>
                  
                  <div className={styles.actionsList}>
                    {analysisResult.actionItems.map((action, index) => (
                      <div key={index} className={styles.actionItem}>
                        <div className={styles.actionNumber}>{index + 1}</div>
                        <div className={styles.actionText}>
                          <i className={`${styles.actionIcon} fas fa-chevron-right`}></i>
                          {action}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className={styles.actionButtons}>
                  <button className={styles.downloadButton}>
                    <i className={`${styles.downloadIcon} fas fa-file-pdf`}></i> Unduh Laporan Lengkap
                  </button>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => {
                      setAnalysisResult(null);
                      setCvFile(null);
                      setJobDescription('');
                    }}
                  >
                    <i className={`${styles.secondaryIcon} fas fa-redo`}></i> Analisis CV Lain
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.floatingDecoration}>
        <div className={styles.decorationCircle}></div>
        <div className={styles.decorationDots}></div>
      </div>
    </div>
  );
};

export default CVUploadForm;