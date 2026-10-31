'use client';

type Props = {
  total: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onShowAll: () => void;
  onReset: () => void;
  lang: 'en' | 'gu';
};

export default function StepControls({
  total, current, onPrev, onNext, onShowAll, onReset, lang,
}: Props) {
  const showingAll = current >= total - 1 && total > 0;
  const atStart = current < 0;
  const label =
    lang === 'gu'
      ? atStart ? 'પગલું બતાવો' : showingAll ? `બધા ${total} પગલાં` : `પગલું ${current + 1} / ${total}`
      : atStart ? 'Show steps' : showingAll ? `All ${total} steps` : `Step ${current + 1} of ${total}`;

  return (
    <div className="step-controls" role="group" aria-label={lang === 'gu' ? 'ઉકેલના પગલાં' : 'Solution steps'}>
      <span className="step-label muted">{label}</span>
      <div className="step-btns">
        <button type="button" className="pill" onClick={onReset} disabled={atStart}>{lang === 'gu' ? 'શરૂઆત' : 'Reset'}</button>
        <button type="button" className="pill" onClick={onPrev} disabled={atStart}>{lang === 'gu' ? '← પાછળ' : '← Prev'}</button>
        <button type="button" className="pill active" onClick={onNext} disabled={showingAll}>{lang === 'gu' ? 'આગળ →' : 'Next →'}</button>
        <button type="button" className="pill" onClick={onShowAll} disabled={showingAll}>{lang === 'gu' ? 'બધા બતાવો' : 'Show all'}</button>
      </div>
    </div>
  );
}
