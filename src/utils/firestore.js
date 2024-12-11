import { 
    collection, 
    addDoc, 
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query, 
    where, 
    orderBy,
    limit,
    serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { checkSponsorship } from './sponsorshipCheck';

const APPLICATIONS_COLLECTION = 'applications';
const EMAILS_COLLECTION = 'emails';
export const getApplications = async (userId) => {
    const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where("userId", "==", userId),
        orderBy("dateApplied", "desc"),
        limit(100)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateApplied: doc.data().dateApplied?.toDate?.() || null,
        interviewDate: doc.data().interviewDate?.toDate?.() || null,
        createdAt: doc.data().createdAt?.toDate?.() || null
    }));
};

export const addApplication = async (userId, applicationData) => {
    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
        userId,
        company: applicationData.company || '',
        jobTitle: applicationData.jobTitle || '',
        location: applicationData.location || '',
        jobType: applicationData.jobType || '',
        status: applicationData.status || 'Applied',
        postingUrl: applicationData.postingUrl || '',
        salary: applicationData.salary || '',
        notes: applicationData.notes || '',
        contactName: applicationData.contactName || '',
        contactEmail: applicationData.contactEmail || '',
        visaSponsorship: checkSponsorship(applicationData.company),
        dateApplied: serverTimestamp(),
        interviewDate: applicationData.interviewDate ? new Date(applicationData.interviewDate) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
};

export const updateApplication = async (applicationId, updates) => {
    const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
};

export const deleteApplication = async (applicationId) => {
    const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await deleteDoc(docRef);
};

export const checkEmailProcessed = async (userId, emailId) => {
    const q = query(
        collection(db, EMAILS_COLLECTION),
        where("userId", "==", userId),
        where("emailId", "==", emailId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
};

export const markEmailProcessed = async (userId, emailId) => {
    await addDoc(collection(db, EMAILS_COLLECTION), {
        userId,
        emailId,
        processedAt: serverTimestamp()
    });
};
