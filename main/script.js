// Global variables
let currentReportData = null;
let currentItemForPhoto = null;

// Inspection sections configuration
const inspectionSections = {
    electricity: {
        title: 'الأعمال الكهربائية',
        icon: 'fas fa-bolt',
        items: [
            'التوصيلات الكهربائية العامة',
            'لوحة التوزيع الرئيسية',
            'قواطع الحماية والفيوزات',
            'التأريض العام للمبنى',
            'مفاتيح الإضاءة والمقابس',
            'الإضاءة الخارجية',
            'نظام الإنذار المبكر',
            'أنظمة الطاقة الشمسية (إن وجدت)'
        ]
    },
    walls: {
        title: 'الجدران والهيكل',
        icon: 'fas fa-home',
        items: [
            'الأساسات والقواعد',
            'الأعمدة والكمرات',
            'الجدران الحاملة',
            'الجدران غير الحاملة',
            'العزل الحراري والمائي',
            'الشقوق والتصدعات',
            'مقاومة الرطوبة',
            'التهوية الطبيعية'
        ]
    },
    plumbing: {
        title: 'أعمال السباكة',
        icon: 'fas fa-tint',
        items: [
            'شبكة المياه الداخلية',
            'شبكة الصرف الصحي',
            'نظام التغذية بالمياه',
            'خزانات المياه',
            'المضخات والغطاسات',
            'أنظمة معالجة المياه',
            'كشف التسريبات',
            'جودة المياه'
        ]
    },
    safety: {
        title: 'السلامة والأمان',
        icon: 'fas fa-shield-alt',
        items: [
            'أنظمة مكافحة الحريق',
            'مخارج الطوارئ',
            'الإنارة الطارئة',
            'أجهزة الإنذار',
            'طفايات الحريق',
            'أنظمة الرش التلقائي',
            'الحماية من السقوط',
            'أمان المصاعد'
        ]
    },
    hvac: {
        title: 'التكييف والتهوية',
        icon: 'fas fa-wind',
        items: [
            'أنظمة التكييف المركزي',
            'وحدات التكييف المنفصلة',
            'شبكة توزيع الهواء',
            'التهوية الطبيعية',
            'التهوية الصناعية',
            'فلاتر الهواء',
            'عزل مواسير التكييف',
            'أنظمة التحكم في درجة الحرارة'
        ]
    },
    finishing: {
        title: 'أعمال التشطيب',
        icon: 'fas fa-paint-brush',
        items: [
            'الأرضيات والبلاط',
            'الدهانات الداخلية',
            'الدهانات الخارجية',
            'الأبواب والنوافذ',
            'الأسقف المستعارة',
            'الديكورات والتشطيبات',
            'السيراميك والرخام',
            'العوازل والتشطيبات الخارجية'
        ]
    }
};

// Initialize application based on current page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('engineer.html')) {
        initializeEngineerPage();
    } else if (window.location.pathname.includes('index.html')) {
        initializeDashboard();
    }
});

// Engineer Page Functions
function initializeEngineerPage() {
    generateInspectionItems();
    setupFormHandlers();
    setupPhotoHandlers();
    loadExistingData();
}

function generateInspectionItems() {
    Object.keys(inspectionSections).forEach(sectionKey => {
        const section = inspectionSections[sectionKey];
        const container = document.getElementById(`${sectionKey}-items`);
        
        if (container) {
            container.innerHTML = '';
            section.items.forEach((item, index) => {
                const itemElement = createInspectionItem(sectionKey, index, item);
                container.appendChild(itemElement);
            });
        }
    });
}

function createInspectionItem(sectionKey, itemIndex, itemName) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'inspection-item';
    itemDiv.innerHTML = `
        <div class="item-header">
            <div class="item-title">${itemName}</div>
            <div class="item-rating">
                <button type="button" class="rating-option" data-rating="excellent" data-section="${sectionKey}" data-item="${itemIndex}">
                    ممتاز
                </button>
                <button type="button" class="rating-option" data-rating="good" data-section="${sectionKey}" data-item="${itemIndex}">
                    جيد
                </button>
                <button type="button" class="rating-option" data-rating="poor" data-section="${sectionKey}" data-item="${itemIndex}">
                    ضعيف
                </button>
                <button type="button" class="rating-option" data-rating="na" data-section="${sectionKey}" data-item="${itemIndex}">
                    غير منطبق
                </button>
            </div>
        </div>
        <div class="item-details">
            <div class="item-notes">
                <textarea placeholder="ملاحظات..." data-section="${sectionKey}" data-item="${itemIndex}"></textarea>
            </div>
            <div class="item-photo">
                <button type="button" class="photo-upload-btn" data-section="${sectionKey}" data-item="${itemIndex}">
                    رفع صورة
                </button>
                <img style="display: none;" data-section="${sectionKey}" data-item="${itemIndex}">
            </div>
        </div>
    `;
    
    return itemDiv;
}

function setupFormHandlers() {
    // Rating buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('rating-option')) {
            const section = e.target.dataset.section;
            const item = e.target.dataset.item;
            const rating = e.target.dataset.rating;
            
            // Remove active class from siblings
            const siblings = e.target.parentNode.querySelectorAll('.rating-option');
            siblings.forEach(sibling => {
                sibling.classList.remove('excellent', 'good', 'poor', 'na');
            });
            
            // Add active class to clicked button
            e.target.classList.add(rating);
        }
    });

    // Photo upload buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('photo-upload-btn')) {
            currentItemForPhoto = {
                section: e.target.dataset.section,
                item: e.target.dataset.item
            };
            document.getElementById('photoModal').style.display = 'block';
        }
    });

    // Save form
    document.getElementById('saveForm').addEventListener('click', saveFormData);
    
    // View dashboard
    document.getElementById('viewDashboard').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

function setupPhotoHandlers() {
    // Property photo preview
    document.getElementById('propertyPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('propertyPhotoPreview');
                preview.src = e.target.result;
                preview.style.display = 'block';
                document.querySelector('.file-upload-display').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Modal handlers
    const modal = document.getElementById('photoModal');
    const closeModal = modal.querySelector('.close');
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Item photo upload
    document.getElementById('uploadItemPhoto').addEventListener('click', function() {
        const fileInput = document.getElementById('itemPhotoInput');
        const file = fileInput.files[0];
        
        if (file && currentItemForPhoto) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.querySelector(`img[data-section="${currentItemForPhoto.section}"][data-item="${currentItemForPhoto.item}"]`);
                img.src = e.target.result;
                img.style.display = 'block';
                
                // Add click handler to view image in modal
                img.addEventListener('click', function() {
                    showImageModal(e.target.result);
                });
            };
            reader.readAsDataURL(file);
            
            document.getElementById('photoModal').style.display = 'none';
            fileInput.value = '';
        }
    });
}

function saveFormData() {
    const formData = collectFormData();
    
    if (validateFormData(formData)) {
        localStorage.setItem('reportData', JSON.stringify(formData));
        alert('تم حفظ التقرير بنجاح!');
    } else {
        alert('يرجى ملء جميع الحقول المطلوبة');
    }
}

function collectFormData() {
    const formData = {
        reportId: document.getElementById('reportId').value,
        engineerName: document.getElementById('engineerName').value,
        engineerLicense: document.getElementById('engineerLicense').value,
        inspectionDate: document.getElementById('inspectionDate').value,
        propertyLocation: document.getElementById('propertyLocation').value,
        propertyType: document.getElementById('propertyType').value,
        propertyPhoto: document.getElementById('propertyPhotoPreview').src || '',
        sections: {},
        timestamp: new Date().toISOString()
    };

    // Collect inspection data
    Object.keys(inspectionSections).forEach(sectionKey => {
        const section = inspectionSections[sectionKey];
        formData.sections[sectionKey] = {
            title: section.title,
            icon: section.icon,
            items: []
        };

        section.items.forEach((itemName, itemIndex) => {
            const ratingButton = document.querySelector(`.rating-option[data-section="${sectionKey}"][data-item="${itemIndex}"].excellent,
                .rating-option[data-section="${sectionKey}"][data-item="${itemIndex}"].good,
                .rating-option[data-section="${sectionKey}"][data-item="${itemIndex}"].poor,
                .rating-option[data-section="${sectionKey}"][data-item="${itemIndex}"].na`);
            
            const rating = ratingButton ? Array.from(ratingButton.classList).find(cls => 
                ['excellent', 'good', 'poor', 'na'].includes(cls)
            ) : null;
            
            const notes = document.querySelector(`textarea[data-section="${sectionKey}"][data-item="${itemIndex}"]`).value;
            const image = document.querySelector(`img[data-section="${sectionKey}"][data-item="${itemIndex}"]`).src || '';

            formData.sections[sectionKey].items.push({
                name: itemName,
                rating: rating,
                notes: notes,
                image: image
            });
        });
    });

    return formData;
}

function validateFormData(formData) {
    const requiredFields = ['reportId', 'engineerName', 'engineerLicense', 'inspectionDate', 'propertyLocation', 'propertyType'];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
}

function loadExistingData() {
    const savedData = localStorage.getItem('reportData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Load basic info
        document.getElementById('reportId').value = data.reportId || '';
        document.getElementById('engineerName').value = data.engineerName || '';
        document.getElementById('engineerLicense').value = data.engineerLicense || '';
        document.getElementById('inspectionDate').value = data.inspectionDate || '';
        document.getElementById('propertyLocation').value = data.propertyLocation || '';
        document.getElementById('propertyType').value = data.propertyType || '';
        
        // Load property photo
        if (data.propertyPhoto) {
            const preview = document.getElementById('propertyPhotoPreview');
            preview.src = data.propertyPhoto;
            preview.style.display = 'block';
            document.querySelector('.file-upload-display').style.display = 'none';
        }
        
        // Load inspection data
        Object.keys(data.sections || {}).forEach(sectionKey => {
            const sectionData = data.sections[sectionKey];
            sectionData.items.forEach((item, itemIndex) => {
                if (item.rating) {
                    const ratingButton = document.querySelector(`.rating-option[data-section="${sectionKey}"][data-item="${itemIndex}"][data-rating="${item.rating}"]`);
                    if (ratingButton) {
                        ratingButton.classList.add(item.rating);
                    }
                }
                
                if (item.notes) {
                    const textarea = document.querySelector(`textarea[data-section="${sectionKey}"][data-item="${itemIndex}"]`);
                    if (textarea) {
                        textarea.value = item.notes;
                    }
                }
                
                if (item.image) {
                    const img = document.querySelector(`img[data-section="${sectionKey}"][data-item="${itemIndex}"]`);
                    if (img) {
                        img.src = item.image;
                        img.style.display = 'block';
                        img.addEventListener('click', function() {
                            showImageModal(item.image);
                        });
                    }
                }
            });
        });
    }
}

// Dashboard Functions
function initializeDashboard() {
    loadDashboardData();
    setupDashboardHandlers();
}

function loadDashboardData() {
    const savedData = localStorage.getItem('reportData');
    
    if (!savedData) {
        showNoDataMessage();
        return;
    }
    
    currentReportData = JSON.parse(savedData);
    displayDashboardData(currentReportData);
}

function showNoDataMessage() {
    document.getElementById('overallStatus').innerHTML = `
        <div class="status-badge poor">
            <i class="fas fa-exclamation-triangle"></i>
            <span>لا توجد بيانات محفوظة</span>
        </div>
    `;
    
    // Show message to create new report
    const container = document.querySelector('.container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-data-message';
    messageDiv.style.cssText = 'text-align: center; padding: 50px; background: white; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);';
    messageDiv.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 20px;">🏗️</div>
        <h2 style="color: #2d3748; margin-bottom: 15px;">مرحباً بك في نظام فحص المباني</h2>
        <p style="color: #718096; font-size: 1.1rem; margin-bottom: 30px;">لا توجد تقارير محفوظة حالياً. ابدأ بإنشاء تقرير جديد</p>
        <a href="engineer.html" class="btn btn-primary" style="padding: 15px 30px; font-size: 1.1rem;">
            <i class="fas fa-plus"></i> إنشاء تقرير جديد
        </a>
        <div style="margin-top: 30px; padding: 20px; background: #f7fafc; border-radius: 10px; color: #4a5568;">
            <h3 style="margin-bottom: 10px;">خطوات البدء:</h3>
            <div style="text-align: right;">
                <div style="margin: 8px 0;"><i class="fas fa-check" style="color: #48bb78; margin-left: 8px;"></i> اضغط على "إنشاء تقرير جديد"</div>
                <div style="margin: 8px 0;"><i class="fas fa-check" style="color: #48bb78; margin-left: 8px;"></i> املأ بيانات الفحص</div>
                <div style="margin: 8px 0;"><i class="fas fa-check" style="color: #48bb78; margin-left: 8px;"></i> احفظ التقرير وشاهد النتائج</div>
            </div>
        </div>
    `;
    
    container.appendChild(messageDiv);
}

function displayDashboardData(data) {
    // Display basic info
    document.getElementById('reportIdDisplay').textContent = `رقم التقرير: ${data.reportId}`;
    document.getElementById('reportDateDisplay').textContent = `التاريخ: ${new Date(data.inspectionDate).toLocaleDateString('ar-SA')}`;
    document.getElementById('engineerNameDisplay').textContent = data.engineerName;
    document.getElementById('engineerLicenseDisplay').textContent = data.engineerLicense;
    document.getElementById('propertyLocationDisplay').textContent = data.propertyLocation;
    document.getElementById('propertyTypeDisplay').textContent = getPropertyTypeInArabic(data.propertyType);
    
    // Display property photo
    if (data.propertyPhoto) {
        const img = document.getElementById('propertyImageDisplay');
        img.src = data.propertyPhoto;
        img.style.display = 'block';
        img.addEventListener('click', function() {
            showImageModal(data.propertyPhoto);
        });
    }
    
    // Calculate and display scores
    const scores = calculateScores(data);
    displayScores(scores);
    displaySectionScores(data, scores);
    displayDetailedReport(data);
    
    // Initialize charts with data
    initializeCharts(data, scores);
}

function calculateScores(data) {
    let totalItems = 0;
    let passedItems = 0;
    let partialItems = 0;
    let failedItems = 0;
    let naItems = 0;
    
    const sectionScores = {};
    
    Object.keys(data.sections).forEach(sectionKey => {
        const section = data.sections[sectionKey];
        let sectionTotal = 0;
        let sectionPassed = 0;
        let sectionPartial = 0;
        let sectionFailed = 0;
        let sectionNA = 0;
        
        section.items.forEach(item => {
            if (item.rating && item.rating !== 'na') {
                totalItems++;
                sectionTotal++;
                
                switch (item.rating) {
                    case 'excellent':
                        passedItems++;
                        sectionPassed++;
                        break;
                    case 'good':
                        partialItems++;
                        sectionPartial++;
                        break;
                    case 'poor':
                        failedItems++;
                        sectionFailed++;
                        break;
                }
            } else if (item.rating === 'na') {
                naItems++;
                sectionNA++;
            }
        });
        
        // Calculate section score
        const sectionScore = sectionTotal > 0 ? 
            Math.round(((sectionPassed * 100 + sectionPartial * 70) / (sectionTotal * 100)) * 100) : 0;
        
        sectionScores[sectionKey] = {
            score: sectionScore,
            total: sectionTotal,
            passed: sectionPassed,
            partial: sectionPartial,
            failed: sectionFailed,
            na: sectionNA,
            status: getScoreStatus(sectionScore)
        };
    });
    
    // Calculate overall score
    const overallScore = totalItems > 0 ? 
        Math.round(((passedItems * 100 + partialItems * 70) / (totalItems * 100)) * 100) : 0;
    
    return {
        overall: overallScore,
        overallStatus: getScoreStatus(overallScore),
        total: totalItems,
        passed: passedItems,
        partial: partialItems,
        failed: failedItems,
        na: naItems,
        sections: sectionScores
    };
}

function getScoreStatus(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'average';
    return 'poor';
}

function getPropertyTypeInArabic(type) {
    const types = {
        'residential': 'سكني',
        'commercial': 'تجاري',
        'industrial': 'صناعي'
    };
    return types[type] || type;
}

function displayScores(scores) {
    // Overall status
    const statusBadge = document.getElementById('overallStatus').querySelector('.status-badge');
    statusBadge.className = `status-badge ${scores.overallStatus}`;
    statusBadge.innerHTML = `
        <i class="fas ${getStatusIcon(scores.overallStatus)}"></i>
        <span>${getStatusText(scores.overallStatus)}</span>
    `;
    
    // Summary cards
    document.getElementById('overallScore').textContent = scores.overall;
    document.getElementById('passedCount').textContent = scores.passed;
    document.getElementById('partialCount').textContent = scores.partial;
    document.getElementById('failedCount').textContent = scores.failed;
    
    if (scores.total > 0) {
        document.getElementById('passedPercentage').textContent = `${Math.round((scores.passed / scores.total) * 100)}%`;
        document.getElementById('partialPercentage').textContent = `${Math.round((scores.partial / scores.total) * 100)}%`;
        document.getElementById('failedPercentage').textContent = `${Math.round((scores.failed / scores.total) * 100)}%`;
    }
}

function getStatusIcon(status) {
    const icons = {
        'excellent': 'fa-check-circle',
        'good': 'fa-thumbs-up',
        'average': 'fa-exclamation-circle',
        'poor': 'fa-times-circle'
    };
    return icons[status] || 'fa-question-circle';
}

function getStatusText(status) {
    const texts = {
        'excellent': 'ممتاز',
        'good': 'جيد',
        'average': 'متوسط',
        'poor': 'ضعيف'
    };
    return texts[status] || 'غير محدد';
}

function displaySectionScores(data, scores) {
    const container = document.getElementById('sectionsGrid');
    container.innerHTML = '';
    
    Object.keys(data.sections).forEach(sectionKey => {
        const section = data.sections[sectionKey];
        const sectionScore = scores.sections[sectionKey];
        
        const sectionCard = document.createElement('div');
        sectionCard.className = 'section-card';
        sectionCard.innerHTML = `
            <h3>
                <i class="${section.icon}"></i>
                ${section.title}
            </h3>
            <div class="section-score ${sectionScore.status}">${sectionScore.score}</div>
            <div class="section-status ${sectionScore.status}">${getStatusText(sectionScore.status)}</div>
        `;
        
        container.appendChild(sectionCard);
    });
}

function displayDetailedReport(data) {
    const container = document.getElementById('detailedSections');
    container.innerHTML = '';
    
    Object.keys(data.sections).forEach(sectionKey => {
        const section = data.sections[sectionKey];
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'detailed-section';
        
        const sectionHTML = `
            <div class="section-header" onclick="toggleSection('${sectionKey}')">
                <h3>
                    <i class="${section.icon}"></i>
                    ${section.title}
                </h3>
                <i class="fas fa-chevron-down toggle-icon"></i>
            </div>
            <div class="section-content" id="content-${sectionKey}">
                ${section.items.map((item, index) => `
                    <div class="detailed-item">
                        <div class="item-summary">
                            <span class="item-name">${item.name}</span>
                            <span class="item-status ${item.rating || 'na'}">${getStatusText(item.rating) || 'غير مُقيم'}</span>
                        </div>
                        ${item.notes ? `<div class="item-note">${item.notes}</div>` : ''}
                        ${item.image ? `
                            <div class="item-image">
                                <img src="${item.image}" alt="صورة البند" onclick="showImageModal('${item.image}')">
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                
                <div class="section-recommendations">
                    <h4>
                        <i class="fas fa-lightbulb"></i>
                        التوصيات والمراجع
                    </h4>
                    <div class="recommendation-item">
                        <strong>التوصيات:</strong> يرجى مراجعة البنود المرفوضة والعمل على تصحيحها وفقاً للكود السعودي للبناء.
                    </div>
                    <div class="recommendation-item">
                        <strong>المرجع:</strong> الكود السعودي للبناء - الفصل ${getSectionCodeReference(sectionKey)}
                    </div>
                </div>
            </div>
        `;
        
        sectionDiv.innerHTML = sectionHTML;
        container.appendChild(sectionDiv);
    });
}

function getSectionCodeReference(sectionKey) {
    const references = {
        'electricity': 'السابع - الأنظمة الكهربائية',
        'walls': 'الثالث - الهيكل الإنشائي',
        'plumbing': 'السادس - أنظمة السباكة',
        'safety': 'التاسع - السلامة والحماية من الحريق',
        'hvac': 'الثامن - أنظمة التكييف والتهوية',
        'finishing': 'العاشر - التشطيبات'
    };
    return references[sectionKey] || 'عام';
}

function toggleSection(sectionKey) {
    const content = document.getElementById(`content-${sectionKey}`);
    const header = content.previousElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        header.classList.remove('collapsed');
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('hidden');
        header.classList.add('collapsed');
        icon.style.transform = 'rotate(-90deg)';
    }
}

function setupDashboardHandlers() {
    // Edit report button
    document.getElementById('editReport').addEventListener('click', function() {
        window.location.href = 'engineer.html';
    });
    
    // New report button
    document.getElementById('newReport').addEventListener('click', function() {
        if (confirm('هل أنت متأكد من إنشاء تقرير جديد؟ سيتم فقدان البيانات الحالية.')) {
            localStorage.removeItem('reportData');
            window.location.href = 'engineer.html';
        }
    });
    
    // Generate PDF button
    document.getElementById('generatePDF').addEventListener('click', function() {
        generatePDFReport();
    });
}

// PDF Generation Functions
async function generatePDFReport() {
    if (!currentReportData) {
        alert('لا توجد بيانات لتصديرها');
        return;
    }

    try {
        // Show loading message
        const originalText = document.getElementById('generatePDF').innerHTML;
        document.getElementById('generatePDF').innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التصدير...';
        document.getElementById('generatePDF').disabled = true;

        // Create PDF document
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add Arabic font support
        await addArabicSupport(pdf);

        // Generate PDF content
        await generatePDFContent(pdf);

        // Save the PDF
        const fileName = `تقرير_فحص_المباني_${currentReportData.reportId}_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.pdf`;
        pdf.save(fileName);

        // Reset button
        document.getElementById('generatePDF').innerHTML = originalText;
        document.getElementById('generatePDF').disabled = false;

        alert('تم تصدير التقرير بنجاح!');
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('حدث خطأ أثناء تصدير التقرير');
        
        // Reset button
        document.getElementById('generatePDF').innerHTML = originalText;
        document.getElementById('generatePDF').disabled = false;
    }
}

async function addArabicSupport(pdf) {
    // Set RTL direction and Arabic font
    pdf.setLanguage('ar');
    pdf.setFont('helvetica');
}

async function generatePDFContent(pdf) {
    const scores = calculateScores(currentReportData);
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);

    // Header
    yPosition = addPDFHeader(pdf, yPosition, pageWidth, margin);
    
    // Basic Information
    yPosition = addBasicInfo(pdf, yPosition, margin, contentWidth);
    
    // Summary Section
    yPosition = addSummarySection(pdf, yPosition, margin, contentWidth, scores);
    
    // Section Scores
    yPosition = addSectionScores(pdf, yPosition, margin, contentWidth, scores);
    
    // Detailed Report
    yPosition = await addDetailedReport(pdf, yPosition, margin, contentWidth);
    
    // Footer
    addPDFFooter(pdf, margin, contentWidth);
}

function addPDFHeader(pdf, yPosition, pageWidth, margin) {
    // Header background
    pdf.setFillColor(74, 85, 104);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.text('تقرير فحص المباني', pageWidth / 2, 15, { align: 'center' });
    
    // Subtitle
    pdf.setFontSize(12);
    pdf.text('نظام فحص المباني المتقدم', pageWidth / 2, 25, { align: 'center' });
    
    // Reset color
    pdf.setTextColor(0, 0, 0);
    
    return 45;
}

function addBasicInfo(pdf, yPosition, margin, contentWidth) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('المعلومات الأساسية', margin, yPosition);
    yPosition += 10;
    
    // Info box
    pdf.setDrawColor(226, 232, 240);
    pdf.setFillColor(247, 250, 252);
    pdf.rect(margin, yPosition, contentWidth, 35, 'FD');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const infoItems = [
        `رقم التقرير: ${currentReportData.reportId}`,
        `اسم المهندس: ${currentReportData.engineerName}`,
        `رقم الترخيص: ${currentReportData.engineerLicense}`,
        `تاريخ الفحص: ${new Date(currentReportData.inspectionDate).toLocaleDateString('ar-SA')}`,
        `موقع العقار: ${currentReportData.propertyLocation}`,
        `نوع العقار: ${getPropertyTypeInArabic(currentReportData.propertyType)}`
    ];
    
    let infoY = yPosition + 8;
    infoItems.forEach((item, index) => {
        if (index % 2 === 0) {
            pdf.text(item, margin + 5, infoY);
        } else {
            pdf.text(item, margin + contentWidth/2 + 5, infoY);
            infoY += 6;
        }
    });
    
    return yPosition + 45;
}

function addSummarySection(pdf, yPosition, margin, contentWidth, scores) {
    // Check if we need a new page
    if (yPosition > 220) {
        pdf.addPage();
        yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ملخص النتائج', margin, yPosition);
    yPosition += 10;
    
    // Summary boxes
    const boxWidth = contentWidth / 4 - 5;
    const summaryData = [
        { label: 'النتيجة الإجمالية', value: `${scores.overall}%`, color: getScoreColor(scores.overall) },
        { label: 'البنود المقبولة', value: scores.passed, color: [56, 161, 105] },
        { label: 'البنود الجزئية', value: scores.partial, color: [49, 130, 206] },
        { label: 'البنود المرفوضة', value: scores.failed, color: [229, 62, 62] }
    ];
    
    summaryData.forEach((item, index) => {
        const x = margin + (index * (boxWidth + 5));
        
        // Box background
        pdf.setFillColor(...item.color);
        pdf.rect(x, yPosition, boxWidth, 25, 'F');
        
        // Text
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text(item.label, x + boxWidth/2, yPosition + 8, { align: 'center' });
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(item.value), x + boxWidth/2, yPosition + 18, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
    });
    
    pdf.setTextColor(0, 0, 0);
    return yPosition + 35;
}

function addSectionScores(pdf, yPosition, margin, contentWidth, scores) {
    // Check if we need a new page
    if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('درجات الأقسام', margin, yPosition);
    yPosition += 10;
    
    const sectionWidth = contentWidth / 3 - 5;
    let sectionX = margin;
    let sectionY = yPosition;
    let sectionCount = 0;
    
    Object.keys(currentReportData.sections).forEach(sectionKey => {
        const section = currentReportData.sections[sectionKey];
        const sectionScore = scores.sections[sectionKey];
        
        // Check if we need to move to next row
        if (sectionCount > 0 && sectionCount % 3 === 0) {
            sectionY += 35;
            sectionX = margin;
        }
        
        // Section box
        pdf.setDrawColor(226, 232, 240);
        pdf.setFillColor(247, 250, 252);
        pdf.rect(sectionX, sectionY, sectionWidth, 30, 'FD');
        
        // Section title
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(section.title, sectionX + sectionWidth/2, sectionY + 8, { align: 'center' });
        
        // Score
        pdf.setFontSize(16);
        pdf.setTextColor(...getScoreColor(sectionScore.score));
        pdf.text(`${sectionScore.score}%`, sectionX + sectionWidth/2, sectionY + 18, { align: 'center' });
        
        // Status
        pdf.setFontSize(8);
        pdf.text(getStatusText(sectionScore.status), sectionX + sectionWidth/2, sectionY + 25, { align: 'center' });
        
        pdf.setTextColor(0, 0, 0);
        sectionX += sectionWidth + 5;
        sectionCount++;
    });
    
    return sectionY + 45;
}

async function addDetailedReport(pdf, yPosition, margin, contentWidth) {
    // Check if we need a new page
    if (yPosition > 150) {
        pdf.addPage();
        yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('التقرير المفصل', margin, yPosition);
    yPosition += 15;
    
    Object.keys(currentReportData.sections).forEach(sectionKey => {
        const section = currentReportData.sections[sectionKey];
        
        // Check if we need a new page
        if (yPosition > 230) {
            pdf.addPage();
            yPosition = 20;
        }
        
        // Section header
        pdf.setFillColor(74, 85, 104);
        pdf.rect(margin, yPosition, contentWidth, 12, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(section.title, margin + 5, yPosition + 8);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        
        yPosition += 15;
        
        // Section items
        section.items.forEach(item => {
            // Check if we need a new page
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
            }
            
            // Item background
            pdf.setFillColor(255, 255, 255);
            pdf.setDrawColor(226, 232, 240);
            pdf.rect(margin, yPosition, contentWidth, 8, 'FD');
            
            // Item name
            pdf.setFontSize(9);
            pdf.text(item.name, margin + 3, yPosition + 5);
            
            // Item status
            if (item.rating) {
                const statusColor = getStatusColorRGB(item.rating);
                const statusText = getStatusText(item.rating);
                
                pdf.setFillColor(...statusColor);
                pdf.rect(margin + contentWidth - 25, yPosition + 1, 22, 6, 'F');
                
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(7);
                pdf.text(statusText, margin + contentWidth - 14, yPosition + 4.5, { align: 'center' });
                pdf.setTextColor(0, 0, 0);
            }
            
            yPosition += 10;
            
            // Item notes
            if (item.notes && item.notes.trim()) {
                pdf.setFontSize(8);
                pdf.setTextColor(74, 85, 104);
                const noteLines = pdf.splitTextToSize(item.notes, contentWidth - 20);
                pdf.text(noteLines, margin + 10, yPosition);
                yPosition += noteLines.length * 3 + 3;
                pdf.setTextColor(0, 0, 0);
            }
        });
        
        yPosition += 5;
    });
    
    return yPosition;
}

function addPDFFooter(pdf, margin, contentWidth) {
    const pageCount = pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        
        // Footer line
        pdf.setDrawColor(226, 232, 240);
        pdf.line(margin, 285, margin + contentWidth, 285);
        
        // Footer text
        pdf.setFontSize(8);
        pdf.setTextColor(113, 128, 150);
        pdf.text(`تم إنشاء التقرير في: ${new Date().toLocaleDateString('ar-SA')}`, margin, 290);
        pdf.text(`صفحة ${i} من ${pageCount}`, margin + contentWidth - 20, 290);
    }
}

function getScoreColor(score) {
    if (score >= 90) return [56, 161, 105]; // Green
    if (score >= 75) return [49, 130, 206]; // Blue
    if (score >= 60) return [214, 158, 46]; // Yellow
    return [229, 62, 62]; // Red
}

function getStatusColorRGB(status) {
    const colors = {
        'excellent': [56, 161, 105],
        'good': [49, 130, 206],
        'poor': [229, 62, 62],
        'na': [160, 174, 192]
    };
    return colors[status] || [160, 174, 192];
}

// Global chart instances
let chartInstances = {};

// Chart colors configuration
const chartColors = {
    excellent: '#38a169',
    good: '#3182ce', 
    poor: '#e53e3e',
    na: '#a0aec0',
    primary: '#4299e1',
    secondary: '#667eea',
    success: '#48bb78',
    warning: '#ed8936',
    info: '#0bc5ea'
};

// Chart default configuration
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            rtl: true,
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    family: 'Segoe UI',
                    size: 12
                }
            }
        }
    }
};

// Initialize charts when dashboard loads
function initializeCharts(data, scores) {
    try {
        destroyExistingCharts();
        
        // Wait for DOM to be ready
        setTimeout(() => {
            createOverallStatusChart(scores);
            createSectionScoresChart(data, scores);
            createPerformanceRadarChart(data, scores);
            createSectionItemsChart(data, scores);
            updateStatisticsSummary(data, scores);
        }, 100);
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function destroyExistingCharts() {
    Object.values(chartInstances).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    chartInstances = {};
}

// Overall Status Pie Chart
function createOverallStatusChart(scores) {
    const ctx = document.getElementById('overallStatusChart');
    if (!ctx) return;

    const data = {
        labels: ['ممتاز', 'جيد', 'ضعيف', 'غير منطبق'],
        datasets: [{
            data: [scores.passed, scores.partial, scores.failed, scores.na],
            backgroundColor: [
                chartColors.excellent,
                chartColors.good,
                chartColors.poor,
                chartColors.na
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                title: {
                    display: true,
                    text: 'توزيع حالة البنود',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };

    chartInstances.overallStatus = new Chart(ctx, config);
}

// Section Scores Bar Chart
function createSectionScoresChart(data, scores) {
    const ctx = document.getElementById('sectionScoresChart');
    if (!ctx) return;

    const sectionNames = [];
    const sectionScores = [];
    const sectionColors = [];

    Object.keys(data.sections).forEach(sectionKey => {
        const section = data.sections[sectionKey];
        const sectionScore = scores.sections[sectionKey];
        
        sectionNames.push(section.title);
        sectionScores.push(sectionScore.score);
        
        // Color based on score
        if (sectionScore.score >= 90) sectionColors.push(chartColors.excellent);
        else if (sectionScore.score >= 75) sectionColors.push(chartColors.good);
        else if (sectionScore.score >= 60) sectionColors.push(chartColors.warning);
        else sectionColors.push(chartColors.poor);
    });

    const chartData = {
        labels: sectionNames,
        datasets: [{
            label: 'النتيجة %',
            data: sectionScores,
            backgroundColor: sectionColors,
            borderColor: sectionColors,
            borderWidth: 2,
            borderRadius: 6
        }]
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            ...chartDefaults,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                ...chartDefaults.plugins,
                title: {
                    display: true,
                    text: 'درجات الأقسام',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };

    chartInstances.sectionScores = new Chart(ctx, config);
}

// Performance Radar Chart
function createPerformanceRadarChart(data, scores) {
    const ctx = document.getElementById('performanceRadarChart');
    if (!ctx) return;

    const sectionNames = [];
    const sectionScores = [];

    Object.keys(data.sections).forEach(sectionKey => {
        const section = data.sections[sectionKey];
        const sectionScore = scores.sections[sectionKey];
        
        sectionNames.push(section.title);
        sectionScores.push(sectionScore.score);
    });

    const chartData = {
        labels: sectionNames,
        datasets: [{
            label: 'الأداء %',
            data: sectionScores,
            backgroundColor: 'rgba(66, 153, 225, 0.2)',
            borderColor: chartColors.primary,
            borderWidth: 2,
            pointBackgroundColor: chartColors.primary,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
        }]
    };

    const config = {
        type: 'radar',
        data: chartData,
        options: {
            ...chartDefaults,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                ...chartDefaults.plugins,
                title: {
                    display: true,
                    text: 'تحليل الأداء الشامل',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };

    chartInstances.performanceRadar = new Chart(ctx, config);
}

// Section Items Status Chart
function createSectionItemsChart(data, scores) {
    const ctx = document.getElementById('sectionItemsChart');
    if (!ctx) return;

    const sectionNames = [];
    const passedData = [];
    const partialData = [];
    const failedData = [];

    Object.keys(data.sections).forEach(sectionKey => {
        const section = data.sections[sectionKey];
        const sectionScore = scores.sections[sectionKey];
        
        sectionNames.push(section.title);
        passedData.push(sectionScore.passed);
        partialData.push(sectionScore.partial);
        failedData.push(sectionScore.failed);
    });

    const chartData = {
        labels: sectionNames,
        datasets: [
            {
                label: 'ممتاز',
                data: passedData,
                backgroundColor: chartColors.excellent,
                borderColor: chartColors.excellent,
                borderWidth: 1
            },
            {
                label: 'جيد',
                data: partialData,
                backgroundColor: chartColors.good,
                borderColor: chartColors.good,
                borderWidth: 1
            },
            {
                label: 'ضعيف',
                data: failedData,
                backgroundColor: chartColors.poor,
                borderColor: chartColors.poor,
                borderWidth: 1
            }
        ]
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            ...chartDefaults,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            },
            plugins: {
                ...chartDefaults.plugins,
                title: {
                    display: true,
                    text: 'تفصيل البنود حسب القسم',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };

    chartInstances.sectionItems = new Chart(ctx, config);
}

// Update Statistics Summary
function updateStatisticsSummary(data, scores) {
    try {
        // Completion Rate
        const totalItems = scores.total + scores.na;
        const completionRate = totalItems > 0 ? Math.round((scores.total / totalItems) * 100) : 0;
        document.getElementById('completionRate').textContent = completionRate + '%';

        // Best Section
        let bestSection = '';
        let highestScore = -1;
        Object.keys(data.sections).forEach(sectionKey => {
            const sectionScore = scores.sections[sectionKey];
            if (sectionScore.score > highestScore) {
                highestScore = sectionScore.score;
                bestSection = data.sections[sectionKey].title;
            }
        });
        document.getElementById('bestSection').textContent = bestSection || '---';

        // Worst Section
        let worstSection = '';
        let lowestScore = 101;
        Object.keys(data.sections).forEach(sectionKey => {
            const sectionScore = scores.sections[sectionKey];
            if (sectionScore.score < lowestScore && sectionScore.total > 0) {
                lowestScore = sectionScore.score;
                worstSection = data.sections[sectionKey].title;
            }
        });
        document.getElementById('worstSection').textContent = worstSection || '---';

        // Inspection Time (simulated based on data complexity)
        const inspectionTime = calculateInspectionTime(data);
        document.getElementById('inspectionTime').textContent = inspectionTime;

    } catch (error) {
        console.error('Error updating statistics summary:', error);
    }
}

function calculateInspectionTime(data) {
    try {
        let totalItems = 0;
        let itemsWithNotes = 0;
        let itemsWithPhotos = 0;

        Object.keys(data.sections).forEach(sectionKey => {
            const section = data.sections[sectionKey];
            section.items.forEach(item => {
                totalItems++;
                if (item.notes && item.notes.trim()) itemsWithNotes++;
                if (item.image) itemsWithPhotos++;
            });
        });

        // Estimate time based on complexity (base 5 min + additional time for notes/photos)
        const baseTime = Math.max(30, totalItems * 2); // 2 minutes per item minimum
        const notesTime = itemsWithNotes * 3; // 3 extra minutes for notes
        const photosTime = itemsWithPhotos * 2; // 2 extra minutes for photos
        
        const totalMinutes = baseTime + notesTime + photosTime;
        
        if (totalMinutes < 60) {
            return totalMinutes + ' دقيقة';
        } else {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return hours + ' ساعة ' + (minutes > 0 ? minutes + ' دقيقة' : '');
        }
    } catch (error) {
        console.error('Error calculating inspection time:', error);
        return '---';
    }
}

// Export chart as image
function exportChartAsImage(chartInstance, filename) {
    try {
        const url = chartInstance.toBase64Image();
        const link = document.createElement('a');
        link.download = filename + '.png';
        link.href = url;
        link.click();
    } catch (error) {
        console.error('Error exporting chart:', error);
        alert('حدث خطأ أثناء تصدير الرسم البياني');
    }
}

// Add export buttons to charts (optional)
function addChartExportButtons() {
    const chartContainers = document.querySelectorAll('.chart-container');
    
    chartContainers.forEach((container, index) => {
        const chartId = container.querySelector('canvas').id;
        const exportDiv = document.createElement('div');
        exportDiv.className = 'chart-export';
        exportDiv.innerHTML = `
            <button class="export-chart-btn" onclick="exportChartAsImage(chartInstances['${chartId.replace('Chart', '')}'], '${chartId}')">
                <i class="fas fa-download"></i> تصدير
            </button>
        `;
        container.appendChild(exportDiv);
    });
}

// Utility Functions
function showImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modal.style.display = 'block';
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// Add smooth scrolling for better UX
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('section-header')) {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

// Add fade-in animation to elements
function addFadeInAnimation() {
    const elements = document.querySelectorAll('.card, .section-card, .detailed-item');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
}

// Initialize animations when dashboard loads
if (window.location.pathname.includes('index.html')) {
    setTimeout(addFadeInAnimation, 500);
}
   