import { Card, CardContent, Box, Typography } from "@mui/material";
import { BookHeart } from "lucide-react";

export function HayomYomSection() {
  const hebrewText = `כ״ח אלול

הקב״ה, בורא עולם ומנהיגו, קבע במשך ששת ימי בראשית, שיהיו כל הדברים הפכיים זה לזה, חיים ומות, אור וחושך, כו׳.

בארבעת אלפים שנה שמאדם הראשון עד מתן תורה, היו שני ההיפכים אלו מובדלים זה מזה, דבר חי לא יכול להמשיך מות, ודבר מת לא יכול להמשיך חיים.

אבל בשעת מתן תורה, כשהקב״ה נתן את התורה לישראל, ביטל את הגזירה, ונתן כח לכל אחד מישראל, שיוכל באמצעות עבודת השם יתברך, לעשות מדבר מת - חי, ולהפוך חושך - לאור.

וזהו ענין העבודה בתשובה, להפוך גם החטאים שחטא האדם בעבר, לזכיות ומעלות, ולהפוך הרע שבנפשו לטוב, החושך לאור, והמות - לחיים.

זהו כח התשובה שניתן לכל אחד מישראל במתן תורה.`;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <BookHeart style={{ width: '32px', height: '32px', color: '#bca886' }} />
        <Typography variant="h3" sx={{ color: '#8b7355' }}>
          Hayom Yom
        </Typography>
      </Box>
      
      <Card 
        sx={{
          background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(232, 220, 195, 0.5))',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(188, 168, 134, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box>
            <Box sx={{ 
              textAlign: 'center', 
              pb: 2, 
              borderBottom: '1px solid rgba(188, 168, 134, 0.2)',
              mb: 3
            }}>
              <Typography sx={{ color: '#8b7355', fontSize: '1.5rem', fontWeight: 600 }}>
                28 de Elul
              </Typography>
            </Box>
            
            <Box className="hebrew-text" sx={{ color: '#8b7355', lineHeight: 2, fontSize: '1.125rem' }}>
              {hebrewText.split('\n\n').map((paragraph, index) => (
                <Typography 
                  key={index} 
                  className="hebrew-text"
                  sx={{ 
                    color: '#8b7355', 
                    fontSize: '1.125rem',
                    lineHeight: 2,
                    mb: 2 
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}