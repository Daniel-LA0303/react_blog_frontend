// components/reports/ReportModal.tsx
import { useState } from 'react';
import { useSwal } from '../../hooks/useSwal'; // ajusta el path real
import { FlagIcon } from '../../utils/iconsUtils';
import useUserAuthContext from '../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import clientAuthAxios from '../../services/clientAuthAxios';
import UIModal from '../Global/UIModal';
import UISelect from '../Global/UISelect';
import UITextField from '../Global/UITextField';
import UIButton from '../Global/UIButton';

type ReportTargetType = 'User' | 'Post';
type ReportReasonType = 'SPAM' | 'SENSITIVE_INFO' | 'HARASSMENT' | 'OTHER';

const REASON_OPTIONS: { value: ReportReasonType; label: string }[] = [
    { value: 'SPAM', label: 'Spam' },
    { value: 'SENSITIVE_INFO', label: 'Sensitive information' },
    { value: 'HARASSMENT', label: 'Harassment' },
    { value: 'OTHER', label: 'Other' },
];

interface ReportModalProps {
    open: boolean;
    onClose: () => void;
    targetType: ReportTargetType;
    targetId: string | undefined;
}

export const ReportModal = ({ open, onClose, targetType, targetId }: ReportModalProps) => {
    const { userAuth } = useUserAuthContext();
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;
    const { showConfirmSwal } = useSwal();

    const [reasonUserType, setReasonUserType] = useState<ReportReasonType | ''>('');
    const [reasonUser, setReasonUser] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setReasonUserType('');
        setReasonUser('');
        setDescription('');
    };

    const handleClose = () => {
        if (submitting) return; // evita cerrar a medio envío
        resetForm();
        onClose();
    };

    const isValid = reasonUserType !== '' && reasonUser.trim().length > 0;

    const handleSubmit = async () => {
        if (!isValid || submitting) return;

        setSubmitting(true);
        try {

            console.log(targetType);
            console.log(targetId)
            console.log(reasonUser);
            console.log(reasonUserType);
            console.log(description);
            console.log("reportedBy " + userAuth.userId);
            
            await clientAuthAxios.post('/reports/create-report', {
              targetType,
              targetId,
              reasonUserType,
              reasonUser: reasonUser.trim(),
              description: description.trim(),
              reportedBy: userAuth.userId,
            });

            showConfirmSwal({
                message: 'Your report has been submitted. Our team will review it shortly.',
                status: 'success',
                confirmButton: true,
                cancelButton: false,
            });

            resetForm();
            onClose();
        } catch (error: any) {
            showConfirmSwal({
                message: error?.response?.data?.message || 'Something went wrong while submitting your report.',
                status: 'error',
                confirmButton: true,
                cancelButton: false,
            });
            handleClose();
        } finally {
            setSubmitting(false);
        }
    };

    const targetLabel = targetType === 'User' ? 'this user' : 'this post';

    return (
        <UIModal open={open} onClose={handleClose} dark={dark} maxWidth={440}>
            <div className="p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${dark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                        <FlagIcon size={18} />
                    </div>
                    <div>
                        <h3 className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                            Report {targetType === 'User' ? 'user' : 'post'}
                        </h3>
                        <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Help us understand what's wrong with {targetLabel}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4">
                    <UISelect
                        label="Reason"
                        value={reasonUserType}
                        onChange={(e) => setReasonUserType(e.target.value as ReportReasonType)}
                        dark={dark}
                        options={REASON_OPTIONS}
                        placeholder="Select a reason"
                        disabled={submitting}
                    />

                    <UITextField
                        label="Tell us what happened"
                        value={reasonUser}
                        onChange={(e) => setReasonUser(e.target.value)}
                        dark={dark}
                        placeholder={
                            targetType === 'User'
                                ? 'e.g. This user has been sending me harassing messages...'
                                : 'e.g. This post contains misleading information...'
                        }
                        multiline
                        rows={3}
                        disabled={submitting}
                    />

                    <UITextField
                        label="Additional details (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        dark={dark}
                        placeholder="Anything else our team should know?"
                        multiline
                        rows={2}
                        disabled={submitting}
                    />
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                    <UIButton onClick={handleClose} variant="outline" dark={dark} disabled={submitting}>
                        Cancel
                    </UIButton>
                    <UIButton onClick={handleSubmit} variant="danger" dark={dark} disabled={!isValid || submitting}>
                        {submitting ? 'Submitting...' : 'Submit report'}
                    </UIButton>
                </div>
            </div>
        </UIModal>
    );
};