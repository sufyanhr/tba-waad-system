// material-ui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// project imports
import FeatureCard from './FeatureCard';
import SectionTypeset from 'components/pages/SectionTypeset';

// assets
import imgfeature1 from 'assets/images/landing/img-feature1.svg';
import imgfeature2 from 'assets/images/landing/img-feature2.svg';
import imgfeature3 from 'assets/images/landing/img-feature3.svg';

const features = [
  {
    image: imgfeature1,
    title: 'Professional Design',
    description: 'Mantis has fully professional grade user interface for any kind of backend project.'
  },
  {
    image: imgfeature2,
    title: 'Flexible Solution',
    description: 'Highly flexible to work around using Mantis React Template.'
  },
  {
    image: imgfeature3,
    title: 'Effective Documentation',
    description: 'Need help? Check out the detailed Documentation guide.'
  }
];

// ==============================|| LANDING - FEATURE PAGE ||============================== //

export default function FeatureBlock() {
  return (
    <Container>
      <Grid container spacing={2.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Grid size={12}>
          <Grid container spacing={1} sx={{ mb: 3.5, textAlign: 'center', justifyContent: 'center' }}>
            <Grid size={{ sm: 10, md: 6 }}>
              <SectionTypeset
                caption="Mantis nailed it!"
                heading="Why Mantis?"
                description="Customize everything with the Mantis React Material-UI Dashboard Template built with latest MUI v6 component library"
              />
            </Grid>
          </Grid>
        </Grid>

        {features.map((feature, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
